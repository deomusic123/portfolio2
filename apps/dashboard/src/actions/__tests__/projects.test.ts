import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createProject, convertLeadToProject, createTask, updateTaskStatus, updateTaskPriority } from '../projects';

// Mocks
let supabaseMock: any;

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => supabaseMock),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

const user = { id: 'user-1' };

function makeTableMock() {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    insert: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockResolvedValue({ error: null, data: null }),
  };
  return chain;
}

function makeSupabaseMock(overrides: Record<string, unknown> = {}) {
  const projectsTable = makeTableMock();
  const leadsTable = makeTableMock();
  const tasksTable = makeTableMock();

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
    },
    from: vi.fn((table: string) => {
      if (table === 'projects') return projectsTable;
      if (table === 'leads') return leadsTable;
      if (table === 'tasks') return tasksTable;
      throw new Error(`Unexpected table ${table}`);
    }),
    ...overrides,
    __tables: { projectsTable, leadsTable, tasksTable },
  };
}

describe('projects actions', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createProject', () => {
    beforeEach(() => {
      supabaseMock = makeSupabaseMock();
    });

    it('returns error when unauthenticated', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
      const res = await createProject({ name: 'Demo', client_name: 'ACME' });
      expect(res.success).toBe(false);
    });

    it('inserts project with user_id', async () => {
      const insertMock = vi.fn().mockResolvedValue({ error: null });
      supabaseMock = makeSupabaseMock();
      supabaseMock.__tables.projectsTable.insert = insertMock;

      const res = await createProject({ name: 'Demo', client_name: 'ACME' });
      expect(res.success).toBe(true);
      expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ user_id: user.id }));
    });
  });

  describe('convertLeadToProject', () => {
    beforeEach(() => {
      supabaseMock = makeSupabaseMock();
    });

    it('returns error when unauthenticated', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
      const res = await convertLeadToProject('lead-1');
      expect(res.success).toBe(false);
    });

    it('returns existing project when already linked', async () => {
      supabaseMock.__tables.projectsTable.maybeSingle.mockResolvedValue({ data: { id: 'project-1' }, error: null });
      const res = await convertLeadToProject('lead-1');
      expect(res.success).toBe(true);
      expect(res.projectId).toBe('project-1');
    });

    it('creates project from lead when none exists', async () => {
      supabaseMock.__tables.projectsTable.maybeSingle.mockResolvedValue({ data: null, error: null });
      supabaseMock.__tables.leadsTable.single.mockResolvedValue({
        data: { id: 'lead-1', name: 'Foo', company_name: 'ACME' },
        error: null,
      });
      supabaseMock.__tables.projectsTable.insert.mockResolvedValue({ data: { id: 'project-2' }, error: null });
      supabaseMock.__tables.projectsTable.select = vi.fn().mockReturnThis();
      supabaseMock.__tables.leadsTable.eq.mockReturnThis();
      supabaseMock.__tables.projectsTable.eq.mockReturnThis();

      const res = await convertLeadToProject('lead-1');
      expect(res.success).toBe(true);
      expect(res.projectId).toBe('project-2');
      expect(supabaseMock.__tables.leadsTable.update).toHaveBeenCalled();
    });
  });

  describe('tasks actions', () => {
    beforeEach(() => {
      supabaseMock = makeSupabaseMock();
    });

    it('createTask fails when unauthenticated', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
      const res = await createTask({ project_id: 'p1', title: 'T1' });
      expect(res.success).toBe(false);
    });

    it('createTask inserts with user_id', async () => {
      const insertMock = vi.fn().mockResolvedValue({ error: null });
      supabaseMock.__tables.tasksTable.insert = insertMock;
      const res = await createTask({ project_id: 'p1', title: 'T1' });
      expect(res.success).toBe(true);
      expect(insertMock).toHaveBeenCalledWith(expect.objectContaining({ user_id: user.id }));
    });

    it('updateTaskStatus calls update scoped by user and revalidates', async () => {
      const updateMock = vi.fn().mockResolvedValue({ error: null, data: { project_id: 'p1' } });
      supabaseMock.__tables.tasksTable.update = updateMock;
      supabaseMock.__tables.tasksTable.select = vi.fn().mockReturnThis();
      supabaseMock.__tables.tasksTable.eq = vi.fn().mockReturnThis();
      const res = await updateTaskStatus('t1', 'done');
      expect(res.success).toBe(true);
      expect(updateMock).toHaveBeenCalled();
    });

    it('updateTaskPriority calls update scoped by user and revalidates', async () => {
      const updateMock = vi.fn().mockResolvedValue({ error: null, data: { project_id: 'p1' } });
      supabaseMock.__tables.tasksTable.update = updateMock;
      supabaseMock.__tables.tasksTable.select = vi.fn().mockReturnThis();
      supabaseMock.__tables.tasksTable.eq = vi.fn().mockReturnThis();
      const res = await updateTaskPriority('t1', 'high');
      expect(res.success).toBe(true);
      expect(updateMock).toHaveBeenCalled();
    });
  });
});
