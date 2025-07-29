import CompanyDB from './CompanyDB';
import CompanySidebar from './CompanySidebar';

const CompanyRec = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Sidebar - Full width on mobile/tablet, 1/4 width on large screens */}
        <div className="w-full lg:w-1/4">
          <CompanySidebar />
        </div>

        {/* Dashboard Content - Full width on mobile/tablet, 3/4 on large screens */}
        <div className="w-full lg:w-3/4">
          <CompanyDB />
        </div>
      </div>
    </div>
  );
};

export default CompanyRec;
