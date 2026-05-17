'use client'

import React from 'react'

export default function RequestsTable() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
      <table className="w-full text-sm text-right whitespace-nowrap md:whitespace-normal">
        <thead className="bg-white text-blue-500 border-b border-slate-100">
          <tr>
            <th className="px-6 py-4 font-semibold w-1/4">النوع</th>
            <th className="px-6 py-4 font-semibold w-1/4">التاريخ</th>
            <th className="px-6 py-4 font-semibold w-1/4">الموقع</th>
            <th className="px-6 py-4 font-semibold w-1/4">الحالة</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-slate-700">
          <tr className="hover:bg-slate-50">
            <td className="px-6 py-4 font-semibold text-blue-500">طلب إسعاف</td>
            <td className="px-6 py-4">١٢ أكتوبر ٢٠٢٣</td>
            <td className="px-6 py-4">شارع الشفاء، غزة</td>
            <td className="px-6 py-4 font-semibold text-slate-800">مكتمل</td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="px-6 py-4 font-semibold text-blue-500">إمدادات مياه</td>
            <td className="px-6 py-4">٥ سبتمبر ٢٠٢٣</td>
            <td className="px-6 py-4">شارع الشفاء، غزة</td>
            <td className="px-6 py-4 font-semibold text-slate-800">مكتمل</td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="px-6 py-4 font-semibold text-blue-500">إبلاغ عن خطر</td>
            <td className="px-6 py-4">٢٠ أغسطس ٢٠٢٣</td>
            <td className="px-6 py-4">شارع الشفاء، غزة</td>
            <td className="px-6 py-4 font-semibold text-slate-800">مكتمل</td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="px-6 py-4 font-semibold text-blue-500">طلب إسعاف</td>
            <td className="px-6 py-4">٥ سبتمبر ٢٠٢٣</td>
            <td className="px-6 py-4">شارع الشفاء، غزة</td>
            <td className="px-6 py-4 font-semibold text-slate-800">مكتمل</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
