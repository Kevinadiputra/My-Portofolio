const EMPTY_SNAPSHOT = {
    projects: { total: 0, published: 0, featured: 0 },
    certificates: { total: 0, published: 0 },
    experience: { total: 0, published: 0 },
    education: { total: 0, published: 0 },
    skills: { total: 0, published: 0 },
    messages: { total: 0, unread: 0 },
    drafts: 0,
    recentChanges: [],
};

export async function getAdminContentSnapshot(supabase) {
    const tableQueries = {
        projects: "id, title, slug, is_published, is_featured, updated_at",
        certificates: "id, title, is_published, updated_at",
        experience: "id, position, organization, is_published, updated_at",
        education: "id, institution, degree, is_published, updated_at",
        skills: "id, name, category, is_published, updated_at",
        profiles: "id, name, updated_at",
        site_settings: "id, site_name, updated_at",
    };

    const tables = Object.keys(tableQueries);
    const results = await Promise.all(
        tables.map(async (table) => {
            const { data, error } = await supabase
                .from(table)
                .select(tableQueries[table])
                .order("updated_at", { ascending: false });

            return { table, data: error ? [] : data || [] };
        }),
    );

    const messagesResult = await supabase
        .from("contact_messages")
        .select("id, status");

    const messageRows = messagesResult.error ? [] : messagesResult.data || [];
    const unreadMessages = messageRows.filter((row) => row.status === "new").length;

    const byTable = Object.fromEntries(results.map(({ table, data }) => [table, data]));
    const projectRows = byTable.projects || [];
    const certificateRows = byTable.certificates || [];
    const experienceRows = byTable.experience || [];
    const educationRows = byTable.education || [];
    const skillRows = byTable.skills || [];

    const allRows = results.flatMap(({ table, data }) => data.map((row) => ({ table, row })));

    const routeMap = {
        projects: "/admin/projects",
        certificates: "/admin/certificates",
        experience: "/admin/experience",
        education: "/admin/education",
        skills: "/admin/skills",
        profiles: "/admin/profile",
        site_settings: "/admin/settings",
    };

    const recentChanges = allRows
        .filter(({ row }) => row.updated_at)
        .sort((a, b) => new Date(b.row.updated_at) - new Date(a.row.updated_at))
        .slice(0, 8)
        .map(({ table, row }) => ({
            id: row.id,
            type: table.replace("_", " "),
            href: routeMap[table] || "/admin",
            isPublished: "is_published" in row ? Boolean(row.is_published) : true,
            label:
                row.title ||
                (row.position && row.organization ? `${row.position} · ${row.organization}` : row.position) ||
                (row.degree && row.institution ? `${row.degree} · ${row.institution}` : row.institution) ||
                row.name ||
                row.site_name ||
                "Untitled entry",
            updatedAt: row.updated_at,
        }));

    const isPublished = (row) => row.is_published === true;
    const isDraft = (row) => "is_published" in row && row.is_published === false;

    const draftCount = [
        ...projectRows,
        ...certificateRows,
        ...experienceRows,
        ...educationRows,
        ...skillRows,
    ].filter(isDraft).length;

    return {
        ...EMPTY_SNAPSHOT,
        projects: {
            total: projectRows.length,
            published: projectRows.filter(isPublished).length,
            featured: projectRows.filter((row) => row.is_featured).length,
        },
        certificates: {
            total: certificateRows.length,
            published: certificateRows.filter(isPublished).length,
        },
        experience: {
            total: experienceRows.length,
            published: experienceRows.filter(isPublished).length,
        },
        education: {
            total: educationRows.length,
            published: educationRows.filter(isPublished).length,
        },
        skills: {
            total: skillRows.length,
            published: skillRows.filter(isPublished).length,
        },
        messages: {
            total: messageRows.length,
            unread: unreadMessages,
        },
        drafts: draftCount,
        recentChanges,
    };
}
