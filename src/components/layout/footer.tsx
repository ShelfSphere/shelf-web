import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Shelf" width={32} height={32} />
              <span className="text-xl font-bold text-white">Shelf</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              The marketplace connecting supermarkets with product owners for
              premium, transparent shelf placement.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-gray-500">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-xs uppercase tracking-widest text-gray-500">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/sign-up" className="hover:text-white transition-colors">Get started</Link></li>
              <li><Link href="/sign-in" className="hover:text-white transition-colors">Sign in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span>© {new Date().getFullYear()} Shelf. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built with <span className="text-brand-green mx-1">♥</span> for supermarkets and brands
          </span>
        </div>
      </div>
    </footer>
  );
}
