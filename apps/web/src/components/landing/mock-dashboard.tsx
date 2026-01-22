'use client';

export function MockDashboard() {
  return (
    <div className="relative w-full max-w-[1200px] mx-auto px-6" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}>
      {/* Glow effects */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-gradient-to-r from-blue-500/60 via-purple-500/70 to-pink-500/60 blur-3xl rounded-[100%] animate-pulse" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-10 bg-black/50 blur-2xl rounded-[100%] animate-pulse" />
      
      <div className="relative rounded-2xl border-4 border-[#6C6C6C] p-5 bg-[#222222] shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-float">
        <div className="rounded-xl overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
          {/* Dashboard Content */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Portfolio2</h3>
                  <p className="text-zinc-500 text-xs">Agency Dashboard</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg border border-white/10 transition-colors">
                + New Project
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-800/50 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Leads</p>
                <p className="text-white text-2xl font-bold">156</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-800/50 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                    <span className="text-xl">🚀</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Active Projects</p>
                <p className="text-white text-2xl font-bold">23</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-800/50 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-xl">✅</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Conversion</p>
                <p className="text-white text-2xl font-bold">68%</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-800/50 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Revenue</p>
                <p className="text-white text-2xl font-bold">$45K</p>
              </div>
            </div>

            {/* Leads Pipeline & Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Leads Pipeline */}
              <div className="p-6 rounded-xl bg-zinc-800/30 border border-white/5">
                <h4 className="text-white font-bold mb-4">Leads Pipeline</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">New</span>
                      <span className="text-white font-bold">45</span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '75%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Contacted</span>
                      <span className="text-white font-bold">32</span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '55%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">Qualified</span>
                      <span className="text-white font-bold">18</span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '35%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-6 rounded-xl bg-zinc-800/30 border border-white/5">
                <h4 className="text-white font-bold mb-4">Recent Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">AM</div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Ana M.</p>
                      <p className="text-zinc-500 text-xs">created new lead</p>
                    </div>
                    <span className="text-zinc-600 text-xs">2m ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">CR</div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Carlos R.</p>
                      <p className="text-zinc-500 text-xs">updated project</p>
                    </div>
                    <span className="text-zinc-600 text-xs">15m ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold">ST</div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Sofía T.</p>
                      <p className="text-zinc-500 text-xs">sent proposal</p>
                    </div>
                    <span className="text-zinc-600 text-xs">1h ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10 opacity-50" />
        </div>
      </div>
    </div>
  );
}
