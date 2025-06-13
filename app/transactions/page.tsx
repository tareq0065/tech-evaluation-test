"use client";
import React, { useEffect, useState } from "react";
import { TransactionTable, Transaction } from "@/app/components/TransactionTable";

type TransactionType = "Stake" | "Borrow" | "Lend";
const TRANSACTION_TYPES: ("All" | TransactionType)[] = ["All", "Stake", "Borrow", "Lend"];

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<"All" | TransactionType>("All");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchTransactions = async (type: "All" | TransactionType, pg: number) => {
        setLoading(true);
        try {
            let url = `http://localhost:5800/api/transactions?page=${pg}&pageSize=5`;
            if (type && type !== "All") url += `&type=${type}`;
            const res = await fetch(url);
            const data = await res.json();
            setTransactions(Array.isArray(data.data) ? data.data : []);
            setPage(data.page || 1);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setTransactions([]);
            setPage(1);
            setTotalPages(1);
        }
        setTimeout(() => {
            setLoading(false);
        }, 2000)

    };

    useEffect(() => {
        fetchTransactions(filter, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, page]);

    // Reset page to 1 when filter changes
    useEffect(() => {
        setPage(1);
    }, [filter]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl text-center font-bold mb-6">Recent Transactions</h1>

            <div className="flex gap-2 mb-4">
                {TRANSACTION_TYPES.map((type) => (
                    <button
                        key={type}
                        className={`px-4 py-2 rounded 
              ${filter === type ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}
              font-semibold focus:outline-none`}
                        onClick={() => setFilter(type)}
                        type="button"
                        disabled={loading}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <TransactionTable
                transactions={transactions}
                page={page}
                totalPages={totalPages}
                loading={loading}
                onPageChange={setPage}
            />
        </div>
    );
}
