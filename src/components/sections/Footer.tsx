import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white py-24 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-16 md:gap-32">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-cursive text-primary mb-6">Tommy Cleaners</h2>
          <p className="text-white/60 text-lg max-w-sm">Premium NYC personal cleaning for your home and sanctuary. NYC&apos;s trusted cleaners since 2018.</p>
        </div>

        <div className="flex flex-col items-center md:items-start gap-8">
            <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-white/40">Connect</h3>
            <a href="mailto:hello@tommycleaners.com" className="text-2xl hover:text-primary transition-colors font-medium">hello@tommycleaners.com</a>
            <p className="text-xl text-white/60">@tommy_cleaners</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-12 mt-auto">
             <div className="flex flex-col items-center md:items-end gap-4">
                <p className="text-white/40 text-sm italic">&quot;Trust the process. Love the clean.&quot;</p>
             </div>
             <Link 
                href="/staff" 
                className="text-xs uppercase tracking-widest text-white/20 hover:text-primary transition-colors border border-white/10 px-6 py-2 rounded-full mt-4"
             >
                Staff Portal
             </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-xs tracking-widest uppercase">
          <p>© {new Date().getFullYear()} Tommy Cleaners NYC</p>
          <div className="flex gap-8">
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>
      </div>
    </footer>
  );
}
