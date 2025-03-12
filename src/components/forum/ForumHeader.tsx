
interface ForumHeaderProps {
  showSampleData: boolean;
}

const ForumHeader = ({ showSampleData }: ForumHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Foro de Familea</h1>
      <p className="text-gray-600">
        Comparte tus preguntas, sugerencias y experiencias con la comunidad de Familea.
      </p>
      {showSampleData && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-700 text-sm">
            <strong>Nota:</strong> Estás viendo contenido de ejemplo. Los comentarios que añadas se guardarán en la base de datos.
          </p>
        </div>
      )}
    </div>
  );
};

export default ForumHeader;
