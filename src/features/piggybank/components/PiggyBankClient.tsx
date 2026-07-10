"use client";
import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { formatIDR } from "@/components/common/CurrencyDisplay";
import Pagination from "@/components/tables/Pagination";
import { useLocale } from "@/context/LocaleContext";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { toast } from "sonner";

const PAGE_SIZE = 10;

interface PiggyEntry {
  id: string;
  description: string;
  amount: number;
  type: "IN" | "OUT";
  date: string;
  rawDate: string;
  createdAt: string;
}

export default function PiggyBankClient() {
  const { t } = useLocale();

  const [entries, setEntries] = useState<PiggyEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PiggyEntry | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"IN" | "OUT">("IN");
  function toLocalDateString(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [entryDate, setEntryDate] = useState(toLocalDateString(new Date()));
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/piggybank");
      const data = await res.json();
      setEntries(
        data.entries.map((e: { id: string; description: string; amount: number; type: "IN" | "OUT"; date: string; createdAt: string }) => ({
          ...e,
          amount: Number(e.amount),
          rawDate: e.date.slice(0, 10),
          date: new Date(e.date).toLocaleDateString("id-ID"),
          createdAt: new Date(e.createdAt).toLocaleDateString("id-ID"),
        })),
      );
      setTotal(data.balance);
    } catch {
      toast.error(t.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const openAddForm = () => {
    setEditingEntry(null);
    setDescription("");
    setAmount("");
    setType("IN");
    setEntryDate(toLocalDateString(new Date()));
    setShowForm(true);
  };

  const openEditForm = (entry: PiggyEntry) => {
    setEditingEntry(entry);
    setDescription(entry.description);
    setAmount(entry.amount.toString());
    setType(entry.type);
    setEntryDate(entry.rawDate);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    setSaving(true);
    try {
      if (editingEntry) {
        await fetch(`/api/piggybank/${editingEntry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            amount: Number(amount),
            type,
            date: entryDate,
          }),
        });
      } else {
        await fetch("/api/piggybank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description,
            amount: Number(amount),
            type,
            date: entryDate,
          }),
        });
      }
      setDescription("");
      setAmount("");
      setType("IN");
      setEntryDate(toLocalDateString(new Date()));
      setShowForm(false);
      setEditingEntry(null);
      toast.success(editingEntry ? t.piggyBank.updated : t.piggyBank.created);
      fetchEntries();
    } catch {
      toast.error(t.common.errorOccurred);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);

    try {
      await fetch(`/api/piggybank/${deleteId}`, {
        method: "DELETE",
      });

      setDeleteId(null);
      toast.success(t.piggyBank.deleted);
      fetchEntries();
    } catch {
      toast.error(t.common.errorOccurred);
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    const header = `${t.piggyBank.descriptionLabel},${t.piggyBank.amount},${t.piggyBank.type},${t.piggyBank.date}\n`;
    const rows = entries
      .map(
        (e) =>
          `"${e.description}",${e.type === "IN" ? e.amount : -e.amount},${e.type},${e.date}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "piggybank-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatAmount = (amount: number, type: string) => {
    const prefix = type === "IN" ? "+" : "-";
    return `${prefix} ${formatIDR(amount)}`;
  };

  const formatRupiah = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("id-ID").format(Number(digits));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setAmount(digits);
  };

  const totalPages = Math.ceil(entries.length / PAGE_SIZE);
  const paginatedEntries = entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return <div className="text-gray-500">{t.common.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t.piggyBank.totalBalance}
          </p>
          <p
            className={`text-2xl font-semibold ${total >= 0 ? "text-gray-800 dark:text-white/90" : "text-error-500"}`}
          >
            {formatIDR(total)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            {t.piggyBank.downloadCsv}
          </Button>
          <Button size="sm" onClick={openAddForm}>
            + {t.piggyBank.addEntry}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.piggyBank.descriptionLabel}
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.piggyBank.amount}
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.piggyBank.type}
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.piggyBank.date}
                </th>
                <th className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t.piggyBank.action}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {entries.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-gray-500"
                  >
                    {t.piggyBank.noEntries}
                  </td>
                </tr>
              )}
              {paginatedEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-5 py-4 text-sm font-medium text-gray-800 dark:text-white/90">
                    {entry.description}
                  </td>
                  <td
                    className={`px-5 py-4 text-sm ${entry.type === "IN" ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatAmount(entry.amount, entry.type)}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${entry.type === "IN"
                        ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                        }`}
                    >
                      {entry.type === "IN" ? "Masuk" : "Keluar"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {entry.date}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => openEditForm(entry)}
                        className="text-sm text-brand-500 hover:text-brand-700"
                      >
                        {t.common.edit}
                      </button>
                      <button
                        onClick={() => setDeleteId(entry.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        {t.common.delete}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end px-5 py-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            previousLabel={t.common.previous}
            nextLabel={t.common.next}
          />
        </div>
      )}

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingEntry(null); setDescription(""); setAmount(""); setType("IN"); }} className="max-w-[400px] p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingEntry ? t.piggyBank.editEntryTitle : t.piggyBank.addEntryTitle}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.piggyBank.descriptionLabel}
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
              placeholder={t.piggyBank.descriptionPlaceholder}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.piggyBank.amount}
            </label>
            <input
              type="text"
              value={amount ? formatRupiah(amount) : ""}
              onChange={handleAmountChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
              placeholder={t.piggyBank.amountPlaceholder}
              inputMode="numeric"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.piggyBank.date}
            </label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.piggyBank.type}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "IN" | "OUT")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-white/90"
            >
              <option value="IN">{t.piggyBank.income}</option>
              <option value="OUT">{t.piggyBank.expense}</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              disabled={saving}
            >
              {t.piggyBank.cancel}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t.piggyBank.saving : t.piggyBank.save}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t.piggyBank.deleteTitle}
        message={t.piggyBank.deleteConfirmation}
        confirmText={t.common.delete}
        cancelText={t.common.cancel}
        processingText={t.common.processing}
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
