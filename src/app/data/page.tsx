'use client'
import React from 'react';
import GlassCard from '../../components/GlassCard';
import { useDataConfig } from "./_hooks/useDataConfig";
import DataTable from "./_components/DataTable"

const DataPage: React.FC = () => {
  const {profiles,allKeys}=useDataConfig();
  return (
    <GlassCard>
      <h2 className="text-2xl font-bold mb-4">User Profiles Dashboard</h2>
        <p className="text-gray-600 mb-6">View all user submissions from the onboarding flow</p>
        <DataTable profiles={profiles} allKeys={allKeys} />
    </GlassCard>
  );
};

export default DataPage;