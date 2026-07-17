import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import MachineForm from "../components/Machinery/MachineForm";
import MachineCard from "../components/Machinery/MachineCard";
import MachineryInsights from "../components/Machinery/MachineryInsights";

import {
  getMachines,
  addMachine,
  updateMachine,
  getMachineServices,
  getAllMaintenancePlans,
} from "../services/machineryService";

import { generateMachineryAnalytics } from "../utils/machineryAnalytics";

export default function Machinery() {
  const navigate = useNavigate();

  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [maintenancePlans, setMaintenancePlans] = useState([]);

  useEffect(() => {
    loadMachines();
  }, []);

  async function loadMachines() {
    try {
      const [data, services, plans] = await Promise.all([
        getMachines(),
        loadAllServices(),
        getAllMaintenancePlans(),
      ]);
      setMachines(data);
      setServiceHistory(services);
      setMaintenancePlans(plans);
    } catch (err) {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  }

  async function loadAllServices() {
    try {
      const machines = await getMachines();
      const allServices = [];
      for (const machine of machines) {
        const services = await getMachineServices(machine.id);
        allServices.push(...services);
      }
      return allServices;
    } catch {
      return [];
    }
  }

  async function handleSaveMachine(machine) {
    try {
      if (machine.id) {
        await updateMachine(machine.id, machine);
      } else {
        await addMachine(machine);
      }
      setShowForm(false);
      setEditingMachine(null);
      await loadMachines();
    } catch (err) {
      console.error("Save Machine:", err);
    }
  }

  function handleViewMachine(machine) {
    navigate(`/machinery/${machine.id}`);
  }

  function handleEditMachine(machine) {
    setEditingMachine(machine);
    setShowForm(true);
  }

  function handleServiceMachine(machine) {
    navigate(`/machinery/${machine.id}`);
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Loading machinery...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>

      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            🚜 Machinery Management
          </Typography>

          <Typography
            color="text.secondary"
          >
            Manage your farm equipment,
            maintenance and servicing.
          </Typography>

        </Box>

        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingMachine(null);
            setShowForm(true);
          }}
        >
          Add Machine
        </Button>

      </Box>

      {/* Dashboard Cards */}

      <Grid
        container
        spacing={3}
      >
        <Grid size={{ xs: 12, md: 2 }}>
          <MachineStatCard
            title="Machines"
            value={machines.length}
            color="#2e7d32"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <MachineStatCard
            title="Active"
            value={machines.filter((m) => m.status === "Active").length}
            color="#1976d2"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <MachineStatCard
            title="In Service"
            value={machines.filter((m) => m.status === "In Service").length}
            color="#ed6c02"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <MachineStatCard
            title="Services Due"
            value="0"
            color="#d32f2f"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <MachineStatCard
            title="Fleet Value"
            value={`R${machines.reduce((sum, m) => sum + (Number(m.purchase_price) || 0), 0).toLocaleString()}`}
            color="#6a1b9a"
          />
        </Grid>
      </Grid>

      {/* Machinery Insights */}

      <Box sx={{ mt: 3 }}>
        <MachineryInsights
          analytics={generateMachineryAnalytics({
            machines,
            serviceHistory,
            maintenancePlans,
          })}
        />
      </Box>

      {/* Machine Form */}

      {showForm && (
        <Box sx={{ mt: 4 }}>
          <MachineForm
            onSave={handleSaveMachine}
            onCancel={() => {
              setShowForm(false);
              setEditingMachine(null);
            }}
            initialValues={editingMachine || {}}
          />
        </Box>
      )}

      {/* Machine Grid */}

      {machines.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 4 }}>
          {machines.map((machine) => (
            <Grid key={machine.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <MachineCard
                machine={machine}
                onView={handleViewMachine}
                onEdit={handleEditMachine}
                onService={handleServiceMachine}
                lastService={serviceHistory.find((s) => s.machine_id === machine.id)}
                maintenancePlan={maintenancePlans.find((p) => p.machine_id === machine.id)}
                serviceHistory={serviceHistory.filter((s) => s.machine_id === machine.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}

      {machines.length === 0 && !showForm && (
        <Box
          sx={{
            mt: 5,
            border: "2px dashed #ddd",
            borderRadius: 4,
            p: 8,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
          >
            🚜 No Machinery Added Yet
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Add your first tractor,
            vehicle or implement
            to start tracking
            maintenance and costs.
          </Typography>

          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
          >
            Add Your First Machine
          </Button>

        </Box>
      )}

    </Box>
  );
}

function MachineStatCard({
  title,
  value,
  color,
}) {
  return (
    <Box
      sx={{
        bgcolor: color,
        color: "#fff",
        borderRadius: 3,
        p: 3,
      }}
    >
      <Typography
        variant="body2"
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        fontWeight={700}
      >
        {value}
      </Typography>
    </Box>
  );
}
