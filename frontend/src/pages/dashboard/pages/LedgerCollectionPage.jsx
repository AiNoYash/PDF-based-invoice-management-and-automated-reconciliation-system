import React, { useState, useEffect } from 'react';
import './LedgerCollectionPage.css';
import { useOutletContext } from 'react-router-dom';

import { CreateLedgerModal } from "./components/CreateLedgerModal";

export const LedgerCollectionPage = () => {

  const { showCreateModalOverlay, setShowCreateModalOverlay } = useOutletContext();

  return (
    <>
      {showCreateModalOverlay && <CreateLedgerModal isOpen={showCreateModalOverlay} onClose={() => { setShowCreateModalOverlay(false); }} />}

      

    </>
  );
};

