const express = require("express");
let { sequelize } = require("./lib/index");
let { department } = require("./models/department");
let { employee } = require("./models/employee");
let { role } = require("./models/role");

const app = express();
app.use(express.json());

// Sample Data
const employees = [
  { employeeId: 1, name: "Rahul Sharma", email: "rahul.sharma@example.com", departmentId: 1, roleId: 1 },
  { employeeId: 2, name: "Priya Singh", email: "priya.singh@example.com", departmentId: 2, roleId: 2 },
  { employeeId: 3, name: "Ankit Verma", email: "ankit.verma@example.com", departmentId: 1, roleId: 3 },
];

const departments = [
  { departmentId: 1, name: "Engineering" },
  { departmentId: 2, name: "Marketing" },
];

const roles = [
  { roleId: 1, title: "Software Engineer" },
  { roleId: 2, title: "Marketing Specialist" },
  { roleId: 3, title: "Product Manager" },
];

// Endpoint to seed the database
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await role.bulkCreate(roles);
    await department.bulkCreate(departments);
    await employee.bulkCreate(employees);
    res.status(200).json("Data seeded successfully!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get all employees
async function getAllEmployees() {
  let allEmployees = await employee.findAll();
  return { employees: allEmployees };
}

// Endpoint to get all employees
app.get("/employees", async (req, res) => {
  try {
    let response = await getAllEmployees();
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to get employee details by ID
async function getEmployeeDetails(id) {
  let employeeData = await employee.findOne({ where: { employeeId: id } });
  return { employee: employeeData };
}

// Endpoint to get employee details by ID
app.get("/employees/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let response = await getEmployeeDetails(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function to get employees by department ID
async function getEmployeeDepartment(departmentId) {
  let employees = await employee.findAll({ where: { departmentId } });
  return { employees };
}

// Endpoint to get employees by department ID
app.get("/employees/department/:departmentId", async (req, res) => {
  try {
    let departmentId = parseInt(req.params.departmentId);
    let response = await getEmployeeDepartment(departmentId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function to get employees by role ID
async function getEmployeeRoles(roleId) {
  let employees = await employee.findAll({ where: { roleId } });
  return { employees };
}

// Endpoint to get employees by role ID
app.get("/employees/role/:roleId", async (req, res) => {
  try {
    let roleId = parseInt(req.params.roleId);
    let response = await getEmployeeRoles(roleId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function to sort employees by name
async function sortEmployeesByName(orderBy) {
  let results = await employee.findAll({ order: [["name", orderBy]] });
  return { results };
}

// Endpoint to get employees sorted by name
app.get("/employees/sort-by-name", async (req, res) => {
  try {
    let orderBy = req.query.order || "ASC"; // Default to ascending
    let response = await sortEmployeesByName(orderBy);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function to add a new employee
async function addNewEmployee(data) {
  let newEmp = await employee.create(data);
  return { newEmp };
}

// Endpoint to add a new employee
app.post("/employees/new", async (req, res) => {
  try {
    let data = req.body;
    let response = await addNewEmployee(data);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function to delete an employee
async function deleteEmployee(id) {
  let record = await employee.destroy({ where: { employeeId: id } });
  if (record === 0) {
    return { message: `No employee found with ID: ${id}` };
  }
  return { message: `Employee with ID ${id} deleted successfully` };
}

// Endpoint to delete an employee
app.post("/employees/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let response = await deleteEmployee(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Helper function to update employee details
async function updateEmployeeDetails(newData, id) {
  let existingEmployee = await employee.findOne({ where: { employeeId: id } });
  if (!existingEmployee) {
    return { message: "Employee not found" };
  }
  await existingEmployee.update(newData);
  return { updatedEmployee: existingEmployee };
}

// Endpoint to update employee details
app.post("/employees/update/:id", async (req, res) => {
  try {
    let newData = req.body;
    let id = parseInt(req.params.id);
    let response = await updateEmployeeDetails(newData, id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
