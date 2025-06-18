import { toast } from 'react-toastify';

const scheduleService = {
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
          { field: { Name: "day_of_week" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "room" } },
          { field: { Name: "course_id" } }
        ],
        orderBy: [
          { fieldName: "day_of_week", sorttype: "ASC" },
          { fieldName: "start_time", sorttype: "ASC" }
        ]
      };

      const response = await apperClient.fetchRecords('schedule', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to load schedules");
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
          { field: { Name: "day_of_week" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "room" } },
          { field: { Name: "course_id" } }
        ]
      };

      const response = await apperClient.getRecordById('schedule', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule with ID ${id}:`, error);
      toast.error("Failed to load schedule");
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
          { field: { Name: "day_of_week" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "room" } },
          { field: { Name: "course_id" } }
        ],
        where: [
          { FieldName: "course_id", Operator: "EqualTo", Values: [parseInt(courseId, 10)] }
        ]
      };

      const response = await apperClient.fetchRecords('schedule', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching schedules by course:", error);
      toast.error("Failed to load schedules");
      return [];
    }
  },

  async getByDay(dayOfWeek) {
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
          { field: { Name: "day_of_week" } },
          { field: { Name: "start_time" } },
          { field: { Name: "end_time" } },
          { field: { Name: "room" } },
          { field: { Name: "course_id" } }
        ],
        where: [
          { FieldName: "day_of_week", Operator: "EqualTo", Values: [dayOfWeek] }
        ]
      };

      const response = await apperClient.fetchRecords('schedule', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching schedules by day:", error);
      toast.error("Failed to load schedules");
      return [];
    }
  },

  async create(scheduleData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: scheduleData.Name || `${scheduleData.day_of_week} Schedule`,
        Tags: scheduleData.Tags || scheduleData.tags || "",
        Owner: scheduleData.Owner || scheduleData.owner,
        day_of_week: scheduleData.day_of_week || scheduleData.dayOfWeek,
        start_time: scheduleData.start_time || scheduleData.startTime,
        end_time: scheduleData.end_time || scheduleData.endTime,
        room: scheduleData.room,
        course_id: parseInt(scheduleData.course_id || scheduleData.courseId, 10)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('schedule', params);
      
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
          toast.success("Schedule created successfully");
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating schedule:", error);
      toast.error("Failed to create schedule");
      return null;
    }
  },

  async update(id, scheduleData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Id: parseInt(id, 10),
        Name: scheduleData.Name || `${scheduleData.day_of_week} Schedule`,
        Tags: scheduleData.Tags || scheduleData.tags,
        Owner: scheduleData.Owner || scheduleData.owner,
        day_of_week: scheduleData.day_of_week || scheduleData.dayOfWeek,
        start_time: scheduleData.start_time || scheduleData.startTime,
        end_time: scheduleData.end_time || scheduleData.endTime,
        room: scheduleData.room,
        course_id: parseInt(scheduleData.course_id || scheduleData.courseId, 10)
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('schedule', params);
      
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
          toast.success("Schedule updated successfully");
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule");
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

      const response = await apperClient.deleteRecord('schedule', params);
      
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
          toast.success("Schedule deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to delete schedule");
      return false;
    }
  }
};

export default scheduleService;