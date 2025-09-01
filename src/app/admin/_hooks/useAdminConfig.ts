"use client"
import { useCallback, useEffect,useMemo, useState } from "react";
import { getCustomComponents, getPageConfigs, createCustomComponent, updatePageConfig, initializeDefaults } from "../../../../server/actions/admin";
import type { CustomComponent, PageConfig, ComponentType } from "../../../types/components";

export function useAdminConfig(){
    const [customComponents, setCustomComponents] = useState<CustomComponent[]>([]);
    const [pageConfigs, setPageConfigs] = useState<PageConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await initializeDefaults().catch(() => {});
            const [ccData, pcData] = await Promise.all([getCustomComponents(), getPageConfigs()]);
            setCustomComponents(ccData);
            setPageConfigs(pcData);
        } catch (e) {
            setError(`Failed to load admin data: ${e instanceof Error ? e.message : "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void refresh(); }, [refresh]);

    const builtInNames = useMemo(() => ["aboutMe", "birthdate", "address"], []);
    const builtInComponents = useMemo(
        () => customComponents.filter(c => builtInNames.includes(c.name)),
        [customComponents, builtInNames]
    );

    const customOnlyComponents = useMemo(
        () => customComponents.filter(c => !builtInNames.includes(c.name)),
        [customComponents, builtInNames]
    );

    const addComponent = useCallback(async (payload : {
        name:string; 
        label:string; 
        type:ComponentType; 
        required:boolean; 
        placeholder:string; 
        options:string[] | null; 
    }) => {
        const response = await createCustomComponent(payload);
        if (!response.success) {
            throw new Error(response.error || "Failed to create component");
        }
        await refresh();
    },[refresh]);

    const savePageConfig = useCallback(async (page: number, components: string[]) => {
        const res = await updatePageConfig(page, components);
        if (!res.success) throw new Error(res.error || "Failed to update page config");
        
        // Update local state instead of full refresh
        setPageConfigs(prev => {
            const existing = prev.find(cfg => cfg.page === page);
            if (existing) {
                return prev.map(cfg => cfg.page === page ? { ...cfg, components, updated_at: new Date().toISOString() } : cfg);
            } else {
                return [...prev, { 
                    id: `page-${page}`, 
                    page, 
                    title: `Page ${page}`,
                    components,
                    updated_at: new Date().toISOString()
                }];
            }
        });
    }, []);

    return {
        state: {
      loading, error,
      customComponents, pageConfigs,
      builtInComponents, customOnlyComponents,
    },
    actions: { refresh, addComponent, savePageConfig },
    builtInNames
    };
}