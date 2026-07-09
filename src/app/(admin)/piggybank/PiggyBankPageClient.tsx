"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useLocale } from "@/context/LocaleContext";
import PiggyBankClient from "@/features/piggybank/components/PiggyBankClient";

export default function PiggyBankPageClient() {
    const { t } = useLocale();

    return (
        <div>
            <PageBreadcrumb pageTitle={t.piggyBank.pageTitle} />

            <div className="space-y-6">
                <PiggyBankClient />
            </div>
        </div>
    );
}