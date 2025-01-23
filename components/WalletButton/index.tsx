"use client";

import React, { useCallback, useState } from "react";
import { PreferredExtensionModal } from "../PreferredExtensionModal";

export const WalletButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setIsOpen(true);
    },
    []
  );
  const onClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button
        onClick={onClick}
        className={`h-10 w-36 p-2'
          } from-buttonLightFrom to-buttonLightTo dark:from-buttonDarkFrom dark:to-buttonDarkTo dark:bg-boxDark rounded-full bg-gradient-to-r font-medium text-white md:mt-3`}
      >
        Connect Wallet
      </button>
      <PreferredExtensionModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
