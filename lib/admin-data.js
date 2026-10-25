const EMPTY_SNAPSHOT = {
    projects: { total: 0, published: 0 },
    certificates: { total: 0 },
    experience: { total: 0 },
    drafts: 0,
    recentChanges: [],
};

export async function getAdminContentSnapshot(supabase) {
    const tableQueries = {
        projects: "id, title, status, is_published, updated_at",
        certificates: "id, title, is_published, updated_at",
        experience: "id, position, is_published, updated_at",
        education: "id, institution, is_published, updated_at",
        skills: "id, name, is_published, updated_at",
        profiles: "id, name, updated_at",
        site_settings: "id, site_name, updated_at",
    };
    const tables = Object.keys(tableQueries);
    const results = await Promise.all(
        tables.map(async (table) => {
            const { data, error } = await supabase
                .from(table)
                .select(tableQueries[table])
                .order("updated_at", { ascending: false })
                .limit(20);

            return { table, data: error ? [] : data || [] };
        }),
    );

    const byTable = Object.fromEntries(results.map(({ table, data }) => [table, data]));
    const projectRows = byTable.projects || [];
    const certificateRows = byTable.certificates || [];
    const experienceRows = byTable.experience || [];
    const allRows = results.flatMap(({ table, data }) => data.map((row) => ({ table, row })));

    const recentChanges = allRows
        .filter(({ row }) => row.updated_at)
        .sort((a, b) => new Date(b.row.updated_at) - new Date(a.row.updated_at))
        .slice(0, 6)
        .map(({ table, row }) => ({
            id: row.id,
            type: table,
            label: row.title || row.name || row.position || row.institution || row.site_name || "Untitled entry",
            updatedAt: row.updated_at,
        }));

    const published = (row) => row.is_published === true || row.status === "published" || row.status === "Published";
    const drafts = allRows.filter(({ row }) => row.is_published === false || row.status === "draft" || row.status === "Draft").length;

    return {
        ...EMPTY_SNAPSHOT,
        projects: { total: projectRows.length, published: projectRows.filter(published).length },
        certificates: { total: certificateRows.length },
        experience: { total: experienceRows.length },
        drafts,
        recentChanges,
    };
}
