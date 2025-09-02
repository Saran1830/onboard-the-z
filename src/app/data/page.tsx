'use client'
import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { useDataConfig } from "../../components/Hooks/data/useDataConfig";
import DataTable from "../../components/Tables/DataTable"
import { PAGE_TITLES } from '../../constants/ui';

const DataPage: React.FC = () => {
  const { profiles, allKeys, loading, error } = useDataConfig();

  if (loading) {
    return (
      <GlassCard style={{ width: "90%", margin: "auto" }}>
        <h2 className="text-2xl font-bold mb-4">{PAGE_TITLES.DATA}</h2>
        <p className="text-gray-600 mb-6">View all user submissions from the onboarding flow</p>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading profiles...</span>
        </div>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard style={{ width: "90%", margin: "auto" }}>
        <h2 className="text-2xl font-bold mb-4">{PAGE_TITLES.DATA}</h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800">{error}</div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard style={{ width: "90%", margin: "auto" }}>
      <h2 className="text-2xl font-bold mb-4">{PAGE_TITLES.DATA}</h2>
      <p className="text-gray-600 mb-6">View all user submissions from the onboarding flow</p>
      <DataTable profiles={profiles} allKeys={allKeys} />
    </GlassCard>
  );
};

export default DataPage;