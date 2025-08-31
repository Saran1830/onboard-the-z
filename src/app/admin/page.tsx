'use client'

import React,{useState} from 'react';
import GlassCard from '../../components/GlassCard';
import { useAdminConfig } from "./_hooks/useAdminConfig";
import CreateComponentModal from "./_components/CreateComponentModal";
import PageAssignmentPanel from "./_components/PageAssignmentPanel";
import ComponentTable from './_components/ComponentTable';


const AdminPage: React.FC = () => {

  const [showCreateModal, setShowCreateModal] = useState(false);

  const { state, actions, builtInNames } = useAdminConfig();
  const { loading, error, customComponents,builtInComponents, customOnlyComponents, pageConfigs } = state;

  const available = React.useMemo(
    () => [...builtInComponents, ...customOnlyComponents],
    [builtInComponents, customOnlyComponents]
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <GlassCard style={{ width: "90%", margin: "auto" }}>
      <h1 className='text-2xl font-bold  text-center'>Admin Page</h1>
        <h2 className='text-l font-bold mb-8 text-center'>Onboarding component Management Page</h2>
        
        {/* 1) Create Component */}
        <div className="flex justify-center mb-10">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 rounded-xl bg-blue-100 text-blue-700 font-semibold shadow hover:bg-blue-200 transition"
          >
            Create Component
        </button>
        </div>
        <CreateComponentModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={actions.addComponent}
        />

        {/* 2) Page Assignment (2 & 3) */}
        <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Assign Components to Pages</h2>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {[2, 3].map(page => {
            const cfg = pageConfigs.find(c => c.page === page);
            return (
              <PageAssignmentPanel
                key={page}
                page={page}
                available={available}
                builtInNames={builtInNames}
                initialSelection={cfg ? cfg.components : []}
                onSave={(components) => actions.savePageConfig(page, components)}
              />
            );
          })}
        </div>
        {/* 3) Component Table */}
        <div className="flex-1 mt-8 bg-white/70 rounded-xl shadow p-6 border border-gray-200">
          <ComponentTable
            customOnlyComponents={customComponents}
            builtInNames={builtInNames}
            error={error}
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default AdminPage;