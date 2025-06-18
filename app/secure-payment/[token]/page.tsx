"use client";

import { useEffect, useState } from "react";
import { Shield, CreditCard, Lock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { validateSecureToken } from "@/lib/qr-generator";
import { useFetchCards } from "@/hooks/useFetchCard";
import { CreditCardInfo } from "@/types";

export default function SecurePayment({ params }) {
  const { token } = params;
  const [isValid, setIsValid] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    codigo_reservacion: string;
    monto: number;
    id_card: string;
    isSecureCode: boolean;
  }>(null);
  const [cardData, setCardData] = useState<CreditCardInfo | null>(null);
  const [showCardData, setShowCardData] = useState(false);
  const { data, fetchData } = useFetchCards();

  useEffect(() => {
    if (token) {
      const validation = validateSecureToken(token);
      console.log(validation);
      if (validation.valid) {
        setIsValid(true);
        setPaymentData(validation.data);
        fetchData(validation.data.id_card);
      } else {
        setIsValid(false);
      }
    }
  }, []);
  useEffect(() => {
    if (!Array.isArray(data) && data) {
      setCardData(data);
    }
  }, [data]);

  if (!isValid || !paymentData || !cardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-red-200">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-red-600 mb-4">
            El código QR no es válido o ha expirado. Por favor, solicite un
            nuevo código de pago.
          </p>
          <Button
            variant="outline"
            onClick={() => window.close()}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Cerrar Ventana
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Card className="mb-6 p-6 border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="https://www.noktos.com/wp-content/uploads/2022/10/cropped-noktos_logo-300x202.png"
              alt=""
              className="w-12 mr-2"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Pago Seguro</h1>
              <p className="text-sm text-slate-600">
                Datos de tarjeta protegidos
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Details */}
        <Card className="mb-6 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Detalles del Pago
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-600">Reservación ID</p>
              <p className="font-semibold">{paymentData.codigo_reservacion}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Monto a Cobrar</p>
              <p className="font-semibold text-2xl text-green-600">
                ${paymentData.monto.toFixed(2)} MXN
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Instrucciones:</strong> Use los datos de tarjeta mostrados
              abajo para procesar este pago exacto en su terminal de cobro.
            </p>
          </div>
        </Card>

        {/* Card Data Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Datos de la Tarjeta
            </h2>
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>

          {!showCardData ? (
            <div className="text-center py-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                <Lock className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <p className="text-blue-800 font-medium mb-2">
                  Datos Protegidos
                </p>
                <p className="text-sm text-blue-600">
                  Los datos de la tarjeta están cifrados por seguridad. Haga
                  clic en "Mostrar Datos" para revelarlos.
                </p>
              </div>
              <Button
                onClick={() => setShowCardData(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Shield className="mr-2 h-4 w-4" />
                Mostrar Datos de Tarjeta
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-slate-600">
                    Tipo de Tarjeta
                  </p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {cardData.banco_emisor}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      NÚMERO DE TARJETA
                    </p>
                    <p className="text-lg font-mono font-bold text-slate-800 tracking-wider">
                      {cardData.numero_completo}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        FECHA DE VENCIMIENTO
                      </p>
                      <p className="text-lg font-mono font-bold text-slate-800">
                        {cardData.fecha_vencimiento}
                      </p>
                    </div>
                    {paymentData.isSecureCode && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          CÓDIGO CVV
                        </p>
                        <p className="text-lg font-mono font-bold text-slate-800">
                          {cardData.cvv}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-slate-500 mb-1">TITULAR</p>
                    <p className="text-base font-semibold text-slate-800">
                      {cardData.nombre_titular}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">
                  Instrucciones para el Terminal de Cobro:
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>
                    • <strong>Número de tarjeta:</strong> Ingrese exactamente
                    como se muestra
                  </li>
                  <li>
                    • <strong>Fecha de vencimiento:</strong>{" "}
                    {cardData.fecha_vencimiento} (MM/AA)
                  </li>
                  {paymentData.isSecureCode && (
                    <li>
                      • <strong>Código CVV:</strong> {cardData.cvv}
                    </li>
                  )}
                  <li>
                    • <strong>Monto exacto:</strong> $
                    {paymentData.monto.toFixed(2)} MXN
                  </li>
                  <li>
                    • <strong>Titular:</strong> {cardData.nombre_titular}
                  </li>
                  <li>• Procese como pago presencial o telefónico</li>
                </ul>
              </div>

              <Button
                onClick={() => setShowCardData(false)}
                variant="outline"
                className="w-full"
              >
                Ocultar Datos
              </Button>
            </div>
          )}
        </Card>

        {/* Security Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            🔒 Conexión segura • Los datos se eliminarán automáticamente al
            cerrar
          </p>
        </div>
      </div>
    </div>
  );
}
