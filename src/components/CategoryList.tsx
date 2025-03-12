
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface CategoryListProps {
  title: string;
  seeAllLink: string;
  children: React.ReactNode;
}

const CategoryList = ({ title, seeAllLink, children }: CategoryListProps) => {
  return (
    <section className="py-8 sm:py-10">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h2>
          <Link to={seeAllLink}>
            <Button variant="ghost" className="text-familyxp-primary hover:text-familyxp-secondary hover:bg-familyxp-tertiary w-full sm:w-auto">
              Ver todo <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {children}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
