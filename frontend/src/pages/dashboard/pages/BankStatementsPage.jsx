import React, { useState, useEffect } from 'react';
import './BankStatementsPage.css';
import { useOutletContext } from 'react-router-dom';

import { CreateBankStatementGroupModal } from "./components/CreateBankStatementGroupModal";

export const BankStatementsPage = () => {

    const { showCreateModalOverlay, setShowCreateModalOverlay } = useOutletContext();

    return (
        <>
            {showCreateModalOverlay && <CreateBankStatementGroupModal isOpen={showCreateModalOverlay} onClose={() => { setShowCreateModalOverlay(false); }} />}


        </>
    );
};

