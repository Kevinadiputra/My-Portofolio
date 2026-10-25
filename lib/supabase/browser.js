import { createBrowserClient } from "@supabase/ssr";

let supabaseBrowserClient;

export function createSupabaseBrowserClient() {
    if (supabaseBrowserClient) {
        return supabaseBrowserClient;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabasePublishableKey) {
        throw new Error("Supabase public environment variables are not configured.");
    }

    supabaseBrowserClient = createBrowserClient(supabaseUrl, supabasePublishableKey);
    return supabaseBrowserClient;
}
