import React, { useEffect, useState } from 'react'
import DashboardLayout from '../Layout/DashboardLayout'
import { useAuth } from '@clerk/clerk-react';
import { AlertCircle, Loader, Loader2, Receipt } from 'lucide-react';
import axios from 'axios';
import { fetchTransactions } from '../features/transactionSlice';
import { useDispatch, useSelector } from 'react-redux';

const Transactions = () => {

  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const { items: transactions, loading, error } = useSelector(state => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions(getToken));
  }, [dispatch, getToken]);

  const formateDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const formatAmount = (amountInPaise) => {
    return `${(amountInPaise / 100).toFixed(2)}`
  };

  return (
    <>
      <DashboardLayout activeMenu="Transactions">
        <div className='p-6'>
          <div className='flex items-center gap-2 mb-6'>
            <Receipt className='text-purple-600'/>
            <h1 className='text-2xl font-bold'>Transaction History</h1>
          </div>

          {error && (
            <div className='mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2'>
              <AlertCircle size={20}/>
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <Loader2 className='animate-spin mr-2' size={24}/>
              <span>Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className='bg-gray-50 p-8 rounded-lg text-center'>
              <Receipt size={48} className='mx-auto mb-4 text-gray-400'/>
              <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                No Transactions Yet
              </h3>
              <p className='text-gray-500'>
                You haven't made any credit purchases yet. Visit the subscription page to buy credits.
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-white rounded-lg overflow-hidden shadow'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits Added</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment ID</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formateDate(transaction.transactionDate)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {transaction.planId === "premium"
                          ? "Premium Plan"
                          : transaction.planId === "ultimate"
                            ? "Ultimate Plan"
                            : "Basic Plan"}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {formatAmount(transaction.amount)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {transaction.creditsAdded}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {transaction.paymentId
                          ? transaction.paymentId.substring(0,12) + "..."
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  )
}

export default Transactions
