import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CallContext = createContext();

export const CallProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeCall, setActiveCall] = useState(null);
  const [ignoredCalls, setIgnoredCalls] = useState(new Set());
  const pollIntervalRef = useRef(null);

  const fetchActiveCalls = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/calls/active');
      
      if (data && !ignoredCalls.has(data.id)) {
        setActiveCall(curr => {
            if (!curr || curr.id !== data.id) return data;
            return curr;
        });
      } else if (!data) {
        setActiveCall(null);
      }
    } catch (err) {
      console.error("Call polling error:", err);
    }
  }, [user, ignoredCalls]);

  useEffect(() => {
    if (user) {
        fetchActiveCalls();
        pollIntervalRef.current = setInterval(fetchActiveCalls, 5000);
    } else {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setActiveCall(null);
    }

    return () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [user, fetchActiveCalls]);

  const ignoreCall = (callId) => {
    setIgnoredCalls(prev => new Set(prev).add(callId));
    setActiveCall(null);
  };

  const startCall = async (roomName, callType = 'video') => {
      try {
          await api.post('/calls/start', { room_name: roomName, call_type: callType });
          return true;
      } catch (err) {
          console.error("Failed to start call", err);
          return false;
      }
  };

  return (
    <CallContext.Provider value={{ activeCall, ignoreCall, startCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
    return useContext(CallContext);
};
