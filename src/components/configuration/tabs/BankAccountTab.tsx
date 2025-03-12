
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabProps } from "../types";

const BankAccountTab = ({ userProfile, user }: TabProps) => {
  const [bankAccount, setBankAccount] = useState(userProfile?.bank_account || "");
  const [isUpdatingBank, setIsUpdatingBank] = useState(false);
  
  const updateBankAccount = async () => {
    try {
      setIsUpdatingBank(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          bank_account: bankAccount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
        
      if (error) throw error;
      
      toast.success("Datos bancarios actualizados correctamente");
    } catch (error) {
      console.error("Error actualizando los datos bancarios:", error);
      toast.error("Error al actualizar los datos bancarios. Inténtalo de nuevo más tarde.");
    } finally {
      setIsUpdatingBank(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos bancarios</CardTitle>
        <CardDescription>
          Configura tus datos bancarios para recibir pagos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankAccount">IBAN / Número de cuenta</Label>
            <Input
              id="bankAccount"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="ES00 0000 0000 0000 0000 0000"
            />
            <p className="text-xs text-muted-foreground">
              Esta información se usará para procesar pagos. Tus datos bancarios están seguros.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={updateBankAccount} 
            disabled={isUpdatingBank}
          >
            {isUpdatingBank ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankAccountTab;
