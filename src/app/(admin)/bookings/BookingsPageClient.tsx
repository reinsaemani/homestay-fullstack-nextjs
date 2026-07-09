"use client";

import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useLocale } from "@/context/LocaleContext";
import BookingsClient from "@/features/bookings/components/BookingsClients";

// import lain tetap seperti semula

export default function BookingsPageClient() {
    const { t } = useLocale();

    return (
        <div>
            <PageBreadcrumb pageTitle={t.bookings.pageTitle} />

            <div className="space-y-6">
                <BookingsClient />
            </div>
        </div>
    );
}