import React from "react";

export type Transaction = {
    id: string;
    username?: string;
    transactionType: "Stake" | "Borrow" | "Lend";
    token: string;
    amount: number;
    date: string;
    status?: "pending" | "completed" | "failed";
    description?: string;
};

export interface TransactionTableProps {
    transactions: Transaction[];
    page: number;
    totalPages: number;
    loading: boolean;
    onPageChange: (newPage: number) => void;
}

const getPageNumbers = (current: number, total: number) => {
    let start = Math.max(1, current - 1);
    let end = Math.min(total, start + 3);
    if (end - start < 3) start = Math.max(1, end - 3);

    let arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
};

export const TransactionTable: React.FC<TransactionTableProps> = ({
                                                                      transactions,
                                                                      page,
                                                                      totalPages,
                                                                      loading,
                                                                      onPageChange,
                                                                  }) => {
    const pages = getPageNumbers(page, totalPages);

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse mb-2">
                <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Token</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={6} className="text-center py-6">Loading...</td>
                    </tr>
                ) : transactions.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="text-center py-6">No transactions found.</td>
                    </tr>
                ) : (
                    transactions.map((tx, i) => (
                        <tr key={tx.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="px-4 py-2">{tx.username || "-"}</td>
                            <td className="px-4 py-2">{tx.transactionType}</td>
                            <td className="px-4 py-2">{tx.token}</td>
                            <td className="px-4 py-2">{tx.amount}</td>
                            <td className="px-4 py-2 capitalize">{tx.status || "-"}</td>
                            <td className="px-4 py-2">{new Date(tx.date).toLocaleString()}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex items-center gap-1 justify-center py-2">
                <button
                    className="px-3 py-1 rounded bg-gray-200"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1 || loading}
                >
                    Prev
                </button>
                {pages.map((p) => (
                    <button
                        key={p}
                        className={`px-3 py-1 rounded ${p === page ? "bg-blue-600 text-white cursor-not-allowed" : "bg-gray-200"}`}
                        onClick={() => onPageChange(p)}
                        disabled={p === page || loading}
                    >
                        {p}
                    </button>
                ))}
                <button
                    className="px-3 py-1 rounded bg-gray-200"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages || loading}
                >
                    Next
                </button>
            </div>
        </div>
    );
};
