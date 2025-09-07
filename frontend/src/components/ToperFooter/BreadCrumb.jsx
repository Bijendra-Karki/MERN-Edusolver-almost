export function BreadCrumb(props) {
  const { content, icon1: Icon1, icon2: Icon2 } = props;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container-fluid mx-auto px-4 py-4">
        <div className="flex items-start space-x-2 text-sm text-gray-600">
          <Icon1 className="w-4 h-4" /> {/* First icon */}
          <Icon2 className="w-4 h-4" /> {/* Second icon */}
          <span className="text-gray-900 font-medium">{content}</span>
        </div>
      </div>
    </div>
  );
}
