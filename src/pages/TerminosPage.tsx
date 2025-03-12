
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatDate } from "@/components/blog/BlogUtils";

const TerminosPage = () => {
  const lastUpdated = "2024-06-01"; // Fecha de última actualización
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Términos y Condiciones</h1>
            <p className="text-gray-600">
              Última actualización: {formatDate(lastUpdated)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <ScrollArea className="h-[60vh]">
              <div className="pr-4 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">1. Aceptación de los términos</h2>
                  <p className="text-gray-700">
                    Al acceder o utilizar la plataforma Familea ("la plataforma", "nosotros", "nuestro"), aceptas estar legalmente vinculado por estos Términos y Condiciones. Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestros servicios. El uso continuado de la plataforma constituye la aceptación de estos términos.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">2. Descripción del servicio</h2>
                  <p className="text-gray-700">
                    Familea es una plataforma que conecta a familias con actividades y experiencias diseñadas para disfrutar con niños. Proporcionamos información sobre actividades, permitimos realizar reservas y facilitamos la comunicación entre usuarios y proveedores de actividades. Actuamos como intermediarios y no somos responsables directos de la prestación de las actividades ofrecidas por terceros.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">3. Registro de cuenta</h2>
                  <p className="text-gray-700 mb-3">
                    Para utilizar ciertas funcionalidades de nuestra plataforma, deberás crear una cuenta. Al hacerlo:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Debes proporcionar información precisa, actualizada y completa.</li>
                    <li>Eres responsable de mantener la confidencialidad de tu contraseña.</li>
                    <li>Aceptas notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta.</li>
                    <li>Debes tener al menos 18 años o contar con el consentimiento y supervisión de un tutor legal.</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">4. Uso de la plataforma</h2>
                  <p className="text-gray-700 mb-3">
                    Al utilizar nuestra plataforma, aceptas:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>No utilizar la plataforma para fines ilegales o no autorizados.</li>
                    <li>No intentar acceder a áreas restringidas de la plataforma.</li>
                    <li>No interferir con el funcionamiento normal de la plataforma.</li>
                    <li>No publicar contenido ofensivo, difamatorio, ilegal o que infrinja derechos de terceros.</li>
                    <li>No suplantar la identidad de otras personas o entidades.</li>
                    <li>No utilizar la plataforma para enviar material publicitario no solicitado.</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Reservas y pagos</h2>
                  <p className="text-gray-700 mb-3">
                    Al realizar una reserva a través de nuestra plataforma:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Aceptas los términos específicos de la actividad seleccionada.</li>
                    <li>Entiendes que el contrato final es entre tú y el proveedor de la actividad.</li>
                    <li>Nos autorizas a procesar los pagos correspondientes en nombre del proveedor.</li>
                    <li>Reconoces que las políticas de cancelación pueden variar según cada actividad.</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">6. Contenido del usuario</h2>
                  <p className="text-gray-700 mb-3">
                    Al publicar contenido en nuestra plataforma (reseñas, comentarios, fotos, etc.):
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Garantizas que tienes los derechos necesarios sobre dicho contenido.</li>
                    <li>Nos otorgas una licencia mundial, no exclusiva y libre de regalías para usar, reproducir y mostrar dicho contenido.</li>
                    <li>Aceptas que podemos moderar y eliminar contenido que consideremos inapropiado.</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">7. Propiedad intelectual</h2>
                  <p className="text-gray-700">
                    Todos los derechos de propiedad intelectual relacionados con la plataforma, incluyendo textos, gráficos, logotipos, imágenes y software, son propiedad de Familea o de nuestros licenciantes. Estos materiales están protegidos por leyes de propiedad intelectual y no pueden ser utilizados sin nuestro permiso previo por escrito.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">8. Limitación de responsabilidad</h2>
                  <p className="text-gray-700">
                    En la medida permitida por la ley, Familea no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, ni por pérdida de beneficios o ingresos, ya sea directa o indirectamente, ni por pérdida de datos, uso, fondo de comercio u otras pérdidas intangibles. Nuestra responsabilidad total por cualquier reclamación bajo estos términos está limitada a la cantidad que hayas pagado para usar nuestra plataforma en los últimos seis meses.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">9. Indemnización</h2>
                  <p className="text-gray-700">
                    Aceptas indemnizar y mantener indemne a Familea, sus afiliados, directores, empleados y agentes, frente a cualquier reclamación, responsabilidad, daño, pérdida y gasto, incluidos honorarios legales razonables, que surjan de tu incumplimiento de estos términos o del uso indebido de la plataforma.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">10. Modificaciones</h2>
                  <p className="text-gray-700">
                    Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma. Es tu responsabilidad revisar periódicamente estos términos para estar al tanto de cualquier modificación.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">11. Ley aplicable</h2>
                  <p className="text-gray-700">
                    Estos términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus disposiciones sobre conflictos de leyes. Cualquier disputa relacionada con estos términos estará sujeta a la jurisdicción exclusiva de los tribunales de Madrid, España.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">12. Contacto</h2>
                  <p className="text-gray-700">
                    Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos en legal@familea.es.
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

export default TerminosPage;
