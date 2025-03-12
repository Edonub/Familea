import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabProps } from "@/components/configuration/types";
import { Separator } from "@/components/ui/separator";
import { Euro, CreditCard, ArrowDownToLine } from "lucide-react";

interface BankBalance {
  available_balance: number;
  pending_balance: number;
  total_earnings: number;
  last_withdrawal?: {
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  };
}

const BankAccountTab = ({ userProfile, user }: TabProps) => {
  const [bankAccount, setBankAccount] = useState(userProfile?.bank_account || "");
  const [isUpdatingBank, setIsUpdatingBank] = useState(false);
  const [balance, setBalance] = useState<BankBalance>({
    available_balance: 0,
    pending_balance: 0,
    total_earnings: 0
  });
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);

  useEffect(() => {
    fetchBalanceData();
  }, [user?.id]);

  const fetchBalanceData = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('host_balances')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setBalance({
          available_balance: data.available_balance || 0,
          pending_balance: data.pending_balance || 0,
          total_earnings: data.total_earnings || 0,
          last_withdrawal: data.last_withdrawal
        });
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast.error("Error al cargar el saldo");
    }
  };

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
      toast.error("Error al actualizar los datos bancarios");
    } finally {
      setIsUpdatingBank(false);
    }
  };

  const handleWithdrawal = async () => {
    try {
      setIsProcessingWithdrawal(true);
      
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Por favor, introduce una cantidad válida");
        return;
      }

      if (amount > balance.available_balance) {
        toast.error("No tienes suficiente saldo disponible");
        return;
      }

      // Crear solicitud de retiro
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user?.id,
          amount,
          status: 'pending',
          bank_account: bankAccount
        });

      if (error) throw error;

      toast.success("Solicitud de retiro procesada correctamente");
      setWithdrawAmount("");
      fetchBalanceData(); // Actualizar saldos
    } catch (error) {
      console.error("Error procesando el retiro:", error);
      toast.error("Error al procesar el retiro");
    } finally {
      setIsProcessingWithdrawal(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumen financiero</CardTitle>
          <CardDescription>
            Gestiona tus ganancias y retiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Euro className="text-green-600" />
                <h4 className="font-semibold text-green-600">Saldo disponible</h4>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {balance.available_balance.toFixed(2)}€
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="text-orange-600" />
                <h4 className="font-semibold text-orange-600">Saldo pendiente</h4>
              </div>
              <p className="text-2xl font-bold text-orange-700">
                {balance.pending_balance.toFixed(2)}€
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownToLine className="text-blue-600" />
                <h4 className="font-semibold text-blue-600">Ganancias totales</h4>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {balance.total_earnings.toFixed(2)}€
              </p>
            </div>
          </div>

          {balance.last_withdrawal && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Último retiro</h4>
              <div className="flex justify-between text-sm">
                <span>Cantidad: {balance.last_withdrawal.amount.toFixed(2)}€</span>
                <span>Fecha: {new Date(balance.last_withdrawal.date).toLocaleDateString()}</span>
                <span className={`font-medium ${
                  balance.last_withdrawal.status === 'completed' ? 'text-green-600' :
                  balance.last_withdrawal.status === 'pending' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  Estado: {
                    balance.last_withdrawal.status === 'completed' ? 'Completado' :
                    balance.last_withdrawal.status === 'pending' ? 'Pendiente' : 'Fallido'
                  }
                </span>
              </div>
            </div>
          )}

          <Separator className="my-6" />

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
                Esta cuenta se utilizará para procesar tus retiros
              </p>
            </div>

            <Button 
              onClick={updateBankAccount} 
              disabled={isUpdatingBank}
              className="w-full"
            >
              {isUpdatingBank ? "Actualizando..." : "Actualizar cuenta bancaria"}
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdrawAmount">Cantidad a retirar</Label>
              <div className="flex gap-2">
                <Input
                  id="withdrawAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                />
                <Button 
                  onClick={handleWithdrawal}
                  disabled={isProcessingWithdrawal || !bankAccount || !withdrawAmount}
                  className="min-w-32"
                >
                  {isProcessingWithdrawal ? "Procesando..." : "Retirar fondos"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                El retiro mínimo es de 50€. Los retiros se procesan en 1-3 días hábiles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAccountTab;