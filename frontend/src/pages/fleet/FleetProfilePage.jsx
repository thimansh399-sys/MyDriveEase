export default function FleetProfilePage() {

  const user = JSON.parse(
    localStorage.getItem('user')
  );

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Travel Partner Profile
      </h1>

      <div className="bg-[#111827] p-8 rounded-3xl max-w-2xl">

        <div className="mb-5">
          <p className="text-gray-400">
            Company Name
          </p>

          <p className="text-xl font-bold mt-1">
            {user?.companyName}
          </p>
        </div>

        <div className="mb-5">
          <p className="text-gray-400">
            Owner Name
          </p>

          <p className="text-xl font-bold mt-1">
            {user?.ownerName}
          </p>
        </div>

        <div className="mb-5">
          <p className="text-gray-400">
            Email
          </p>

          <p className="text-xl font-bold mt-1">
            {user?.email}
          </p>
        </div>

      </div>

    </div>
  );
}