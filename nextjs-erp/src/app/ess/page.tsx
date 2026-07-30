"use client";

import { useState } from "react";

type Lang = "en" | "id";

const t: Record<Lang, Record<string, string>> = {
  en: {
    title: "Employee Self-Service",
    greeting: "Good Morning, Alex",
    dateLabel: "Today",
    attendance: "Attendance",
    shift: "Shift: 09:00 - 18:00",
    onTime: "On Time",
    checkIn: "Check In",
    checkOut: "Check Out",
    todayHours: "Today's Hours",
    hoursValue: "08:32",
    leaveBalance: "Leave Balance",
    annual: "Annual",
    annualDays: "12 Days",
    sick: "Sick",
    sickDays: "5 Days",
    unpaid: "Unpaid",
    unpaidDays: "3 Days",
    pendingRequests: "Pending Requests",
    vacation: "Vacation Leave",
    dateRange: "Nov 12 - Nov 15",
    awaitingManager: "Awaiting Manager",
    reimbursement: "Reimbursement",
    pendingAmount: "$1,240.50",
    pendingThisMonth: "Pending approval this month",
    viewHistory: "View History",
    documents: "Recent Documents",
    viewAll: "View All",
    payslip: "Monthly Payslip - September 2024",
    payslipMeta: "Digitally Signed ⋅ 2.4 MB",
    download: "Download",
    taxForm: "Tax Declaration (Form 16)",
    taxMeta: "Financial Year 2023-24",
    view: "View",
    bpjs: "BPJS Health Coverage",
    bpjsMeta: "Active ⋅ Coverage 2026",
    profile: "Personal Profile",
    employeeId: "Employee ID",
    empIdValue: "ESS-2024-0156",
    corporateEmail: "Corporate Email",
    emailValue: "alex@erp-pro.com",
    role: "Senior Project Designer",
  },
  id: {
    title: "Layanan Mandiri Karyawan",
    greeting: "Selamat Pagi, Alex",
    dateLabel: "Hari Ini",
    attendance: "Kehadiran",
    shift: "Shift: 09.00 - 18.00",
    onTime: "Tepat Waktu",
    checkIn: "Masuk",
    checkOut: "Keluar",
    todayHours: "Jam Kerja",
    hoursValue: "08:32",
    leaveBalance: "Saldo Cuti",
    annual: "Tahunan",
    annualDays: "12 Hari",
    sick: "Sakit",
    sickDays: "5 Hari",
    unpaid: "Tanpa Gaji",
    unpaidDays: "3 Hari",
    pendingRequests: "Permohonan Menunggu",
    vacation: "Cuti Liburan",
    dateRange: "12 - 15 November",
    awaitingManager: "Menunggu Manajer",
    reimbursement: "Klaim Biaya",
    pendingAmount: "$1,240.50",
    pendingThisMonth: "Menunggu persetujuan bulan ini",
    viewHistory: "Lihat Riwayat",
    documents: "Dokumen Terbaru",
    viewAll: "Lihat Semua",
    payslip: "Slip Gaji Bulanan - September 2024",
    payslipMeta: "Tanda Tangan Digital ⋅ 2.4 MB",
    download: "Unduh",
    taxForm: "Deklarasi Pajak (Formulir 16)",
    taxMeta: "Tahun Fiskal 2023-24",
    view: "Lihat",
    bpjs: "BPJS Kesehatan",
    bpjsMeta: "Aktif ⋅ Cakupan 2026",
    profile: "Profil Pribadi",
    employeeId: "ID Karyawan",
    empIdValue: "ESS-2024-0156",
    corporateEmail: "Email Perusahaan",
    emailValue: "alex@erp-pro.com",
    role: "Desainer Proyek Senior",
  },
};

export default function ESSPage() {
  const [lang, setLang] = useState<Lang>("en");
  const l = t[lang];

  return (
    <div className="min-h-screen bg-background">
      <header className="flex justify-between items-center px-6 h-16 w-full bg-surface border-b border-border shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">{l.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-surface-container-low rounded-full p-1 border border-border">
            <button
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === "en" ? "bg-primary text-on-primary shadow-sm" : "text-secondary"}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${lang === "id" ? "bg-primary text-on-primary shadow-sm" : "text-secondary"}`}
              onClick={() => setLang("id")}
            >
              ID
            </button>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <span className="text-sm font-bold">A</span>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-primary">{l.greeting}</h2>
          <p className="text-sm text-secondary mt-1">{l.dateLabel}, July 30, 2026</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <section className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  {l.attendance}
                </h3>
                <p className="text-lg font-semibold text-on-surface mt-1">{l.shift}</p>
              </div>
            </div>
            <div className="flex flex-col items-center py-4">
              <div className="text-4xl font-bold text-on-surface mb-1">{l.hoursValue}</div>
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {l.onTime}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button className="flex flex-col items-center gap-1 p-4 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-on-primary transition-all active:scale-95">
                <span className="text-lg">⏵</span>
                <span className="text-xs font-medium">{l.checkIn}</span>
              </button>
              <button className="flex flex-col items-center gap-1 p-4 bg-surface-container-high text-secondary rounded-2xl cursor-not-allowed opacity-60">
                <span className="text-lg">⏶</span>
                <span className="text-xs font-medium">{l.checkOut}</span>
              </button>
            </div>
          </section>

          <section className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">
              {l.leaveBalance}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-border text-center">
                <p className="text-xs text-secondary mb-1">{l.annual}</p>
                <p className="text-2xl font-bold text-primary">{l.annualDays}</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-border text-center">
                <p className="text-xs text-secondary mb-1">{l.sick}</p>
                <p className="text-2xl font-bold text-emerald-700">{l.sickDays}</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-border text-center">
                <p className="text-xs text-secondary mb-1">{l.unpaid}</p>
                <p className="text-2xl font-bold text-slate-700">{l.unpaidDays}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">
              {l.reimbursement}
            </h3>
            <div className="bg-primary-container text-on-primary-container rounded-2xl p-6 shadow-md">
              <p className="text-xs font-semibold text-on-primary-container/70 uppercase tracking-wider mb-1">
                {l.pendingThisMonth}
              </p>
              <p className="text-3xl font-bold">{l.pendingAmount}</p>
              <button className="mt-6 w-full py-2 bg-on-primary-container text-primary rounded-xl text-xs font-semibold hover:bg-white transition-colors">
                {l.viewHistory}
              </button>
            </div>
          </section>

          <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">
              {l.pendingRequests}
            </h3>
            <div className="flex items-center justify-between p-3 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-amber-500">⏳</span>
                <div>
                  <p className="text-sm font-medium text-on-surface">{l.vacation}</p>
                  <p className="text-xs text-outline">{l.dateRange}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                {l.awaitingManager}
              </span>
            </div>
          </section>
        </div>

        <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-on-surface">{l.documents}</h3>
            <a href="#" className="text-primary text-sm font-medium hover:underline">
              {l.viewAll}
            </a>
          </div>
          <div className="space-y-3">
            <DocRow
              icon="📄"
              iconBg="bg-red-100 text-red-600"
              title={l.payslip}
              meta={l.payslipMeta}
              action={l.download}
            />
            <DocRow
              icon="📋"
              iconBg="bg-blue-100 text-blue-600"
              title={l.taxForm}
              meta={l.taxMeta}
              action={l.view}
            />
            <DocRow
              icon="🏥"
              iconBg="bg-green-100 text-green-600"
              title={l.bpjs}
              meta={l.bpjsMeta}
              action={l.download}
            />
          </div>
        </section>

        <section className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-4">
            {l.profile}
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full border-4 border-primary/10 overflow-hidden bg-primary/5 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">A</span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h4 className="text-lg font-semibold text-on-surface">Alex Henderson</h4>
              <p className="text-sm text-secondary">{l.role}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-left border-t border-border pt-4">
                <div>
                  <p className="text-xs text-outline">{l.employeeId}</p>
                  <p className="text-sm font-medium text-on-surface">{l.empIdValue}</p>
                </div>
                <div>
                  <p className="text-xs text-outline">{l.corporateEmail}</p>
                  <p className="text-sm font-medium text-on-surface">{l.emailValue}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function DocRow({
  icon,
  iconBg,
  title,
  meta,
  action,
}: {
  icon: string;
  iconBg: string;
  title: string;
  meta: string;
  action: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-on-surface">{title}</p>
          <p className="text-xs text-outline">{meta}</p>
        </div>
      </div>
      <button className="flex items-center gap-2 bg-surface text-primary border border-primary/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-primary hover:text-white transition-all">
        {action}
      </button>
    </div>
  );
}