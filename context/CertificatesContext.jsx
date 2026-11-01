"use client";

import { createContext, useContext, useState } from 'react';
import { DEFAULT_CERTIFICATES } from '@/lib/portfolio-seed';

const CertificatesContext = createContext();

export const useCertificates = () => {
    const context = useContext(CertificatesContext);
    if (!context) {
        throw new Error('useCertificates must be used within a CertificatesProvider');
    }
    return context;
};

export const INITIAL_CERTIFICATES = DEFAULT_CERTIFICATES;

export const CertificatesProvider = ({ children, initialCertificates }) => {
    const [certificates, setCertificates] = useState(initialCertificates || INITIAL_CERTIFICATES);
    const [loading] = useState(false);

    const getCertificate = (id) => {
        return certificates.find(certificate => String(certificate.id) === String(id));
    };

    const value = {
        certificates,
        setCertificates,
        loading,
        getCertificate,
    };

    return (
        <CertificatesContext.Provider value={value}>
            {children}
        </CertificatesContext.Provider>
    );
};

export default CertificatesContext;
