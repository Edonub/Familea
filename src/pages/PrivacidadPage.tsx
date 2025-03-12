
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDate } from "@/components/blog/BlogUtils";

const PrivacidadPage = () => {
  const lastUpdated = "2024-06-01"; // Fecha de última actualización
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Política de Privacidad</h1>
            <p className="text-gray-600">
              Última actualización: {formatDate(lastUpdated)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <ScrollArea className="h-[60vh]">
              <div className="pr-4 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Introducción</h2>
                  <p className="text-gray-700">
                    En Familea ("nosotros", "nuestro", "la plataforma"), respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad explica cómo recopilamos, utilizamos, procesamos y almacenamos tu información cuando utilizas nuestra plataforma de actividades familiares, tanto a través de nuestra aplicación web como de cualquier otro servicio que ofrezcamos.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Información que recopilamos</h2>
                  <p className="text-gray-700 mb-3">
                    Podemos recopilar diferentes tipos de información, incluyendo:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Información de registro:</strong> Nombre, dirección de correo electrónico, contraseña y otros datos de perfil.</li>
                    <li><strong>Información de perfil:</strong> Fotografías, preferencias, intereses y otra información que elijas proporcionar.</li>
                    <li><strong>Información de uso:</strong> Cómo interactúas con nuestra plataforma, qué actividades exploras o reservas.</li>
                    <li><strong>Información de ubicación:</strong> Ubicación aproximada (si lo permites) para mostrarte actividades cercanas.</li>
                    <li><strong>Información del dispositivo:</strong> Tipo de dispositivo, sistema operativo, navegador y otros datos técnicos.</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">3. Cómo utilizamos tu información</h2>
                  <p className="text-gray-700 mb-3">
                    Utilizamos la información recopilada para:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Proporcionar, mantener y mejorar nuestra plataforma.</li>
                    <li>Personalizar tu experiencia y recomendarte actividades que puedan interesarte.</li>
                    <li>Comunicarnos contigo sobre actualizaciones, ofertas o consultas.</li>
                    <li>Procesar reservas y pagos de actividades.</li>
                    <li>Analizar tendencias de uso y mejorar nuestros servicios.</li>
                    <li>Garantizar la seguridad de nuestra plataforma y cumplir con obligaciones legales.</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Compartición de información</h2>
                  <p className="text-gray-700 mb-3">
                    Podemos compartir tu información con:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li><strong>Proveedores de actividades:</strong> Para facilitar reservas y servicios que solicites.</li>
                    <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar nuestra plataforma (procesamiento de pagos, análisis, etc.).</li>
                    <li><strong>Cuando sea requerido por ley:</strong> Para cumplir con obligaciones legales o proteger derechos.</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    No vendemos ni alquilamos tu información personal a terceros con fines de marketing.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Tus derechos</h2>
                  <p className="text-gray-700 mb-3">
                    Dependiendo de tu ubicación, puedes tener los siguientes derechos:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Acceder a tu información personal.</li>
                    <li>Corregir datos inexactos.</li>
                    <li>Eliminar tu información personal.</li>
                    <li>Oponerte al procesamiento de tus datos.</li>
                    <li>Solicitar la portabilidad de tus datos.</li>
                    <li>Retirar tu consentimiento en cualquier momento.</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    Para ejercer estos derechos, contáctanos a través de privacidad@familea.es.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Seguridad de datos</h2>
                  <p className="text-gray-700">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger tu información. Sin embargo, ningún método de transmisión por Internet o de almacenamiento electrónico es 100% seguro, por lo que no podemos garantizar su seguridad absoluta.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Cookies y tecnologías similares</h2>
                  <p className="text-gray-700">
                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el tráfico y personalizar el contenido. Puedes gestionar tus preferencias de cookies a través de la configuración de tu navegador.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Cambios en esta política</h2>
                  <p className="text-gray-700">
                    Podemos actualizar esta política periódicamente. Te notificaremos cualquier cambio significativo a través de nuestra plataforma o por correo electrónico. Te recomendamos revisar esta política regularmente.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">9. Contacto</h2>
                  <p className="text-gray-700">
                    Si tienes preguntas o inquietudes sobre esta política de privacidad o el tratamiento de tus datos, contáctanos en privacidad@familea.es.
                  </p>
                </section>
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacidadPage;
