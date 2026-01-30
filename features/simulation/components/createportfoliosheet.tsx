import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CreatePortfolioSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Créer</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Création portefeuille</SheetTitle>
          <SheetDescription>
            Effectuez la configuration de votre portefeuille. Cliquez sur &quot;Sauvegarder&quot; lorsque
            vous avez fini.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="portfolio-name">Nom</Label>
            <Input id="portfolio-name" defaultValue="Portefeuille 1" required />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="portfolio-description">Description</Label>
            <Input id="portfolio-description" defaultValue="" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="portfolio-capital">Capital initial</Label>
            <Input id="portfolio-capital" type="number" required />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Sauvegarder</Button>
          <SheetClose asChild>
            <Button variant="outline">Annuler</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CreatePortfolioSheet;
