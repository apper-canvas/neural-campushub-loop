import { toast } from 'react-toastify';

const courseService = {
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
          { field: { Name: "code" } },
          { field: { Name: "credits" } },
          { field: { Name: "professor" } },
          { field: { Name: "room" } },
          { field: { Name: "current_grade" } },
          { field: { Name: "color" } },
          { field: { Name: "enrolled" } },
          { field: { Name: "semester" } },
          { field: { Name: "description" } }
        ],
        orderBy: [
          { fieldName: "Name", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('course', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
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
          { field: { Name: "code" } },
          { field: { Name: "credits" } },
          { field: { Name: "professor" } },
          { field: { Name: "room" } },
          { field: { Name: "current_grade" } },
          { field: { Name: "color" } },
          { field: { Name: "enrolled" } },
          { field: { Name: "semester" } },
          { field: { Name: "description" } }
        ]
      };

      const response = await apperClient.getRecordById('course', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching course with ID ${id}:`, error);
      toast.error("Failed to load course");
      return null;
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: courseData.Name || courseData.name,
        Tags: courseData.Tags || courseData.tags || "",
        Owner: courseData.Owner || courseData.owner,
        code: courseData.code,
        credits: parseInt(courseData.credits, 10),
        professor: courseData.professor,
        room: courseData.room,
        current_grade: parseFloat(courseData.current_grade || courseData.currentGrade || 0),
        color: courseData.color,
        enrolled: courseData.enrolled === true,
        semester: courseData.semester,
        description: courseData.description
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('course', params);
      
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
          toast.success("Course created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course");
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: courseData.Name || courseData.name,
        Tags: courseData.Tags || courseData.tags,
        Owner: courseData.Owner || courseData.owner,
        code: courseData.code,
        credits: parseInt(courseData.credits, 10),
        professor: courseData.professor,
        room: courseData.room,
        current_grade: parseFloat(courseData.current_grade || courseData.currentGrade),
        color: courseData.color,
        enrolled: courseData.enrolled === true,
        semester: courseData.semester,
        description: courseData.description
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('course', params);
      
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
          toast.success("Course updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Failed to update course");
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

      const response = await apperClient.deleteRecord('course', params);
      
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
          toast.success("Course deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Failed to delete course");
      return false;
    }
  },

  async enroll(courseId) {
    return this.update(courseId, { enrolled: true });
  },

  async drop(courseId) {
    return this.update(courseId, { enrolled: false });
  }
};

export default courseService;