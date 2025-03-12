
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewsletterSection = () => {
  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Suscríbete a nuestro boletín</h2>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          Recibe cada semana en tu correo electrónico las mejores ideas y planes para disfrutar en familia
        </p>
        <div className="flex max-w-md mx-auto">
          <Input 
            placeholder="Tu correo electrónico" 
            className="rounded-r-none"
          />
          <Button className="rounded-l-none bg-familyxp-primary">
            Suscribirme
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
