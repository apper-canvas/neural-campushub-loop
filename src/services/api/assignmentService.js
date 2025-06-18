import { toast } from 'react-toastify';

const assignmentService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "grade" } },
          { field: { Name: "notes" } },
          { field: { Name: "type" } },
          { field: { Name: "weight" } },
          { field: { Name: "course_id" } }
        ],
        orderBy: [
          { fieldName: "due_date", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "grade" } },
          { field: { Name: "notes" } },
          { field: { Name: "type" } },
          { field: { Name: "weight" } },
          { field: { Name: "course_id" } }
        ]
      };

      const response = await apperClient.getRecordById('assignment', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching assignment with ID ${id}:`, error);
      toast.error("Failed to load assignment");
      return null;
    }
  },

  async getByCourse(courseId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "title" } },
          { field: { Name: "due_date" } },
          { field: { Name: "priority" } },
          { field: { Name: "completed" } },
          { field: { Name: "grade" } },
          { field: { Name: "notes" } },
          { field: { Name: "type" } },
          { field: { Name: "weight" } },
          { field: { Name: "course_id" } }
        ],
        where: [
          { FieldName: "course_id", Operator: "EqualTo", Values: [parseInt(courseId, 10)] }
        ]
      };

      const response = await apperClient.fetchRecords('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching assignments by course:", error);
      toast.error("Failed to load assignments");
      return [];
    }
  },

  async create(assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: assignmentData.Name || assignmentData.title,
        Tags: assignmentData.Tags || assignmentData.tags || "",
        Owner: assignmentData.Owner || assignmentData.owner,
        title: assignmentData.title,
        due_date: assignmentData.due_date || assignmentData.dueDate,
        priority: assignmentData.priority,
        completed: assignmentData.completed === true,
        grade: assignmentData.grade ? parseInt(assignmentData.grade, 10) : null,
        notes: assignmentData.notes || "",
        type: assignmentData.type,
        weight: parseInt(assignmentData.weight, 10),
        course_id: parseInt(assignmentData.course_id || assignmentData.courseId, 10)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Assignment created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
      return null;
    }
  },

  async update(id, assignmentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: assignmentData.Name || assignmentData.title,
        Tags: assignmentData.Tags || assignmentData.tags,
        Owner: assignmentData.Owner || assignmentData.owner,
        title: assignmentData.title,
        due_date: assignmentData.due_date || assignmentData.dueDate,
        priority: assignmentData.priority,
        completed: assignmentData.completed === true,
        grade: assignmentData.grade ? parseInt(assignmentData.grade, 10) : null,
        notes: assignmentData.notes,
        type: assignmentData.type,
        weight: parseInt(assignmentData.weight, 10),
        course_id: parseInt(assignmentData.course_id || assignmentData.courseId, 10)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success("Assignment updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast.error("Failed to update assignment");
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await apperClient.deleteRecord('assignment', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success("Assignment deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("Failed to delete assignment");
      return false;
    }
  },

  async markComplete(id) {
    return this.update(id, { completed: true });
  },

  async markIncomplete(id) {
    return this.update(id, { completed: false });
  }
};

export default assignmentService;