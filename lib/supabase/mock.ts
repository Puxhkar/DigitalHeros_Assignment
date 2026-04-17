/**
 * MOCK SUPABASE CLIENT
 * This is used when no real API keys are provided.
 * It simulates Auth and Database operations using localStorage.
 */

const STORAGE_KEY = 'digitalheros_mock_db';

interface MockDB {
  users: any[];
  profiles: any[];
  scores: any[];
  charities: any[];
  draws: any[];
  winners: any[];
}

function getDB(): MockDB {
  if (typeof window === 'undefined') {
    return { users: [], profiles: [], scores: [], charities: [], draws: [], winners: [] };
  }
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial: MockDB = {
      users: [],
      profiles: [],
      scores: [],
      charities: [
        { id: '1', name: 'Water.org', category: 'Environment', description: 'Safe water and sanitation.', total_raised: 1250, is_active: true },
        { id: '2', name: 'Save the Children', category: 'Children', description: 'Protecting children worldwide.', total_raised: 4800, is_active: true },
        { id: '3', name: 'Ocean Conservancy', category: 'Environment', description: 'Protecting the ocean.', total_raised: 2100, is_active: true },
        { id: '4', name: 'Doctors Without Borders', category: 'Healthcare', description: 'Medical aid where needed most.', total_raised: 8900, is_active: true },
        { id: '5', name: 'World Wildlife Fund', category: 'Wildlife', description: 'Conserving nature.', total_raised: 3400, is_active: true },
      ],
      draws: [],
      winners: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
}

function saveDB(db: MockDB) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }
}

class MockQueryBuilder {
  private table: string;
  private filters: Array<{ type: string; column: string; value: any }> = [];
  private operation: 'select' | 'insert' | 'update' | 'delete' | 'upsert' = 'select';
  private opValues: any = null;
  private sort: { column: string; ascending: boolean } | null = null;
  private limitCount: number | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*') {
    this.operation = 'select';
    return this;
  }

  insert(values: any | any[]) {
    this.operation = 'insert';
    this.opValues = values;
    return this;
  }

  update(values: any) {
    this.operation = 'update';
    this.opValues = values;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  upsert(values: any) {
    this.operation = 'upsert';
    this.opValues = values;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ type: 'in', column, value: values });
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.sort = { column, ascending };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  private execute() {
    const db = getDB();
    let tableData = (db as any)[this.table] || [];

    // Apply filters for non-insert operations
    if (this.operation !== 'insert') {
      this.filters.forEach(f => {
        if (f.type === 'eq') {
          tableData = tableData.filter((item: any) => item[f.column] === f.value);
        } else if (f.type === 'in') {
          tableData = tableData.filter((item: any) => f.value.includes(item[f.column]));
        }
      });
    }

    let result: any = tableData;
    let error: any = null;

    switch (this.operation) {
      case 'select':
        if (this.sort) {
          result.sort((a: any, b: any) => {
            if (a[this.sort!.column] < b[this.sort!.column]) return this.sort!.ascending ? -1 : 1;
            if (a[this.sort!.column] > b[this.sort!.column]) return this.sort!.ascending ? 1 : -1;
            return 0;
          });
        }
        if (this.limitCount) {
          result = result.slice(0, this.limitCount);
        }
        break;

      case 'insert':
        const itemsToInsert = Array.isArray(this.opValues) ? this.opValues : [this.opValues];
        const newItems = itemsToInsert.map(item => ({
          id: Math.random().toString(36).substr(2, 9),
          ...item,
          created_at: new Date().toISOString()
        }));
        (db as any)[this.table].push(...newItems);
        result = newItems;
        saveDB(db);
        break;

      case 'update':
        const allTableData = (db as any)[this.table];
        const affectedIds = tableData.map((item: any) => item.id);
        allTableData.forEach((item: any) => {
          if (affectedIds.includes(item.id)) {
            Object.assign(item, this.opValues);
          }
        });
        result = tableData.map((item: any) => ({ ...item, ...this.opValues }));
        saveDB(db);
        break;

      case 'delete':
        const idsToDelete = tableData.map((item: any) => item.id);
        (db as any)[this.table] = (db as any)[this.table].filter((item: any) => !idsToDelete.includes(item.id));
        result = null;
        saveDB(db);
        break;

      case 'upsert':
        const table = (db as any)[this.table];
        const items = Array.isArray(this.opValues) ? this.opValues : [this.opValues];
        items.forEach((val: any) => {
          const index = table.findIndex((ti: any) => ti.id === val.id);
          if (index > -1) table[index] = { ...table[index], ...val };
          else table.push({ id: Math.random().toString(36).substr(2, 9), ...val, created_at: new Date().toISOString() });
        });
        result = items;
        saveDB(db);
        break;
    }

    return { data: result, error };
  }

  async single() {
    const { data, error } = this.execute();
    return { data: Array.isArray(data) ? data[0] : data, error };
  }

  async then(resolve: any) {
    const { data, error } = this.execute();
    return resolve({ data, error, count: Array.isArray(data) ? data.length : 0 });
  }
}

export const mockClient = {
  auth: {
    async signInWithPassword({ email }: any) {
      const db = getDB();
      let profile = db.profiles.find(p => p.email === email);
      
      // Auto-create profile if it doesn't exist for demo purposes
      if (!profile) {
        const id = Math.random().toString(36).substr(2, 9);
        profile = {
          id,
          email,
          full_name: email.split('@')[0],
          subscription_status: 'active',
          created_at: new Date().toISOString()
        };
        db.profiles.push(profile);
        saveDB(db);
      }
      
      const session = { user: { id: profile.id, email } };
      if (typeof window !== 'undefined') {
        localStorage.setItem('digitalheros_mock_session', JSON.stringify(session));
        document.cookie = `digitalheros_mock_session=${JSON.stringify(session)}; path=/; max-age=3600; SameSite=Lax`;
      }
      return { data: session, error: null };
    },
    async signUp({ email, password, options }: any) {
      const db = getDB();
      const id = Math.random().toString(36).substr(2, 9);
      const user = { id, email };
      db.users.push(user);
      db.profiles.push({
        id,
        email,
        full_name: options?.data?.full_name || email.split('@')[0],
        subscription_status: 'inactive',
        charity_id: options?.data?.charity_id,
        charity_percentage: options?.data?.charity_percentage,
        created_at: new Date().toISOString(),
      });
      saveDB(db);
      const session = { user };
      if (typeof window !== 'undefined') {
        localStorage.setItem('digitalheros_mock_session', JSON.stringify(session));
        document.cookie = `digitalheros_mock_session=${JSON.stringify(session)}; path=/; max-age=3600; SameSite=Lax`;
      }
      return { data: session, error: null };
    },
    async signOut() {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('digitalheros_mock_session');
        document.cookie = 'digitalheros_mock_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      return { error: null };
    },
    async getUser() {
      if (typeof window === 'undefined') return { data: { user: null } };
      const session = localStorage.getItem('digitalheros_mock_session');
      return { data: session ? JSON.parse(session) : { user: null } };
    },
    onAuthStateChange(callback: any) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
  },
  from(table: string) {
    return new MockQueryBuilder(table);
  }
};
