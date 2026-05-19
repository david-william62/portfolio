"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ScrollAwareNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function updateScrolledState() {
      setIsScrolled(window.scrollY > 18);
    }

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrolledState);
    };
  }, []);

  return (
    <nav className={`top-nav${isScrolled ? " is-scrolled" : ""}`} aria-label="Primary navigation">
      <Link href="/" className="brand-mark">
        DW
      </Link>
      <div className="nav-links">
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
      </div>
    </nav>
  );
}
