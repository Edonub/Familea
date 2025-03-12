
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
            {description && (
              <p className="text-gray-600 max-w-md mx-auto">
                {description}
              </p>
            )}
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <p className="text-gray-500">
                Esta página está en construcción. Pronto tendremos más contenido disponible.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlaceholderPage;
