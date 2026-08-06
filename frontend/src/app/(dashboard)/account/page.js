export default function AccountPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-1 font-medium">04 — Account</p>
        <h1 className="font-(family-name:--font-heading) text-[22px] text-white tracking-tight">Shivangi</h1>
        <p className="text-[11px] text-gray-600 mt-1">Personal account overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#0c1017] border rounded-md p-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium mb-2">Profile</p>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-sm bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              S
            </div>
            <div>
              <p className="text-white text-sm font-medium">Shivangi</p>
              <p className="text-gray-600 text-[11px]">Personal</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0c1017] border rounded-md p-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium mb-2">Status</p>
          <p className="text-white text-sm font-medium mb-1">Signed in</p>
          <p className="text-gray-600 text-[11px]">Your account page is ready for future profile and security settings.</p>
        </div>
      </div>
    </div>
  );
}