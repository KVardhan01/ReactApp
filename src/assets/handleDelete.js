const handleDelete = async (id) => {
  try {
    const response = await fetch(
      `https://localhost:7233/api/Token/deleteemployee/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    alert("Deleted successfully");

    // ✅ Remove deleted employee from UI
    setEmployees(employees.filter((e) => e.id !== id));

  } catch (err) {
    alert("Error deleting employee");
    console.error(err);
  }
};