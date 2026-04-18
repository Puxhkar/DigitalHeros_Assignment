import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { generateRandomDraw, generateAlgorithmicDraw, countMatches, getMatchTier, calculatePrizePool } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify admin role
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { logic, month, year, publish } = await req.json() as {
      logic: 'random' | 'most_frequent' | 'least_frequent';
      month: number;
      year: number;
      publish: boolean;
    };

    const admin = await createAdminClient();

    // Get all active subscribers and their scores
    const { data: activeUsers } = await admin
      .from('profiles')
      .select('id, subscription_plan')
      .eq('subscription_status', 'active');

    if (!activeUsers || activeUsers.length === 0) {
      return NextResponse.json({ error: 'No active subscribers' }, { status: 400 });
    }

    // Calculate pool (demo prices: monthly = £9, yearly = £79/12 ≈ £6.58/mo)
    const totalRevenue = activeUsers.reduce((sum: number, u: any) => {
      return sum + (u.subscription_plan === 'yearly' ? 79 / 12 : 9);
    }, 0);
    const pool = calculatePrizePool(totalRevenue);

    // Get all scores for algorithmic mode
    let winningNumbers: number[];

    if (logic === 'random') {
      winningNumbers = generateRandomDraw();
    } else {
      const { data: allScores } = await admin.from('scores').select('score');
      const scoreValues = (allScores ?? []).map((s) => s.score);
      winningNumbers = generateAlgorithmicDraw(scoreValues, logic);
    }

    // Get all user scores for matching
    const { data: userScores } = await admin
      .from('scores')
      .select('user_id, score')
      .in('user_id', activeUsers.map((u) => u.id));

    // Group scores by user
    const userScoreMap: Record<string, number[]> = {};
    for (const s of userScores ?? []) {
      if (!userScoreMap[s.user_id]) userScoreMap[s.user_id] = [];
      userScoreMap[s.user_id].push(s.score);
    }

    // Find winners
    const winners: { userId: string; matchedNumbers: number[]; tier: 3 | 4 | 5 }[] = [];
    for (const [userId, scores] of Object.entries(userScoreMap)) {
      const matched = scores.filter((s) => winningNumbers.includes(s));
      const tier = getMatchTier(matched.length);
      if (tier) {
        winners.push({ userId, matchedNumbers: matched, tier });
      }
    }

    // Calculate individual prizes
    const jackpotWinners = winners.filter((w) => w.tier === 5);
    const tier2Winners = winners.filter((w) => w.tier === 4);
    const tier3Winners = winners.filter((w) => w.tier === 3);

    // Check previous draw for rollover
    const { data: prevDraw } = await admin
      .from('draws')
      .select('jackpot_rolled_over')
      .lt('year', year)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(1)
      .single();

    const rolledOver = prevDraw?.jackpot_rolled_over ?? 0;
    const totalJackpot = pool.jackpot + rolledOver;

    const prizeMap = {
      5: jackpotWinners.length > 0 ? totalJackpot / jackpotWinners.length : 0,
      4: tier2Winners.length > 0 ? pool.tierTwo / tier2Winners.length : 0,
      3: tier3Winners.length > 0 ? pool.tierThree / tier3Winners.length : 0,
    };

    const status = publish ? 'completed' : 'simulated';

    // Upsert draw record
    const { data: draw, error: drawError } = await admin
      .from('draws')
      .upsert({
        month,
        year,
        status,
        draw_logic: logic,
        winning_numbers: winningNumbers,
        pool_amount: totalRevenue,
        jackpot_amount: totalJackpot,
        tier_two_amount: pool.tierTwo,
        tier_three_amount: pool.tierThree,
        jackpot_rolled_over: jackpotWinners.length === 0 ? totalJackpot : 0,
        total_participants: activeUsers.length,
        published_at: publish ? new Date().toISOString() : null,
      }, { onConflict: 'month,year' })
      .select()
      .single();

    if (drawError) throw drawError;

    // Insert winners only when publishing
    if (publish && winners.length > 0) {
      await admin.from('winners').delete().eq('draw_id', draw.id);
      await admin.from('winners').insert(
        winners.map((w) => ({
          draw_id: draw.id,
          user_id: w.userId,
          matched_numbers: w.matchedNumbers,
          match_tier: w.tier,
          prize_amount: prizeMap[w.tier],
          payout_status: 'pending',
        }))
      );
    }

    return NextResponse.json({
      draw,
      winningNumbers,
      winners: winners.map((w) => ({
        userId: w.userId,
        tier: w.tier,
        matchedNumbers: w.matchedNumbers,
        prize: prizeMap[w.tier],
      })),
      totalPool: totalRevenue,
      jackpotRollover: jackpotWinners.length === 0 ? totalJackpot : 0,
    });
  } catch (err: any) {
    console.error('Draw error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
