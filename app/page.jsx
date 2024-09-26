"use client"

import React, { useState, useEffect } from 'react'
import { ArrowDown, ArrowUp, Play, Square, Wifi, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

const SpeedTest = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)
  const [pingLatency, setPingLatency] = useState(0)
  const [idleLatency, setIdleLatency] = useState(0)
  const [ipType, setIpType] = useState('')
  const [currentTest, setCurrentTest] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            if (currentTest === 'download') {
              setCurrentTest('upload')
              return 0
            } else if (currentTest === 'upload') {
              setCurrentTest('ping')
              return 0
            } else {
              setIsRunning(false)
              setCurrentTest(null)
              return 100
            }
          }
          return prevProgress + 2
        })

        if (currentTest === 'download') {
          setDownloadSpeed(Math.random() * 100)
        } else if (currentTest === 'upload') {
          setUploadSpeed(Math.random() * 50)
        } else if (currentTest === 'ping') {
          setPingLatency(Math.random() * 50)
          setIdleLatency(Math.random() * 20)
          setIpType(['IPv4', 'IPv6'][Math.floor(Math.random() * 2)])
        }
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRunning, currentTest])

  const startTest = () => {
    setIsRunning(true)
    setProgress(0)
    setDownloadSpeed(0)
    setUploadSpeed(0)
    setPingLatency(0)
    setIdleLatency(0)
    setIpType('')
    setCurrentTest('download')
  }

  const stopTest = () => {
    setIsRunning(false)
    setCurrentTest(null)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className={`rounded-lg shadow-xl p-8 w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Internet Speed Test</h1>
          <div className="flex items-center">
            <Sun className="w-4 h-4 mr-2" />
            <Switch
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className="w-4 h-4 ml-2" />
          </div>
        </div>
        <div className="relative">
          <svg className="w-64 h-64 mx-auto" viewBox="0 0 100 100">
            <circle
              className={`${darkMode ? 'text-gray-700' : 'text-gray-200'} stroke-current`}
              strokeWidth="10"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
            ></circle>
            <circle
              className="text-primary stroke-current"
              strokeWidth="10"
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
            ></circle>
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-5xl font-bold">
              {currentTest === 'download' ? downloadSpeed.toFixed(2) :
               currentTest === 'upload' ? uploadSpeed.toFixed(2) :
               currentTest === 'ping' ? pingLatency.toFixed(2) : '0.00'}
            </p>
            <p className="text-xl">{currentTest === 'ping' ? 'ms' : 'Mbps'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="text-center">
            <ArrowDown className="w-8 h-8 mx-auto text-primary" />
            <p className="mt-2 font-semibold">Download</p>
            <p className="text-xl font-bold">{downloadSpeed.toFixed(2)} Mbps</p>
          </div>
          <div className="text-center">
            <ArrowUp className="w-8 h-8 mx-auto text-primary" />
            <p className="mt-2 font-semibold">Upload</p>
            <p className="text-xl font-bold">{uploadSpeed.toFixed(2)} Mbps</p>
          </div>
          <div className="text-center">
            <Wifi className="w-8 h-8 mx-auto text-primary" />
            <p className="mt-2 font-semibold">Ping</p>
            <p className="text-xl font-bold">{pingLatency.toFixed(2)} ms</p>
          </div>
          <div className="text-center">
            <Wifi className="w-8 h-8 mx-auto text-primary" />
            <p className="mt-2 font-semibold">Idle Latency</p>
            <p className="text-xl font-bold">{idleLatency.toFixed(2)} ms</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="font-semibold">IP Type</p>
          <p className="text-xl font-bold">{ipType || 'N/A'}</p>
        </div>
        <div className="mt-8">
          <Button
            onClick={isRunning ? stopTest : startTest}
            className={`w-full py-2 px-4 rounded-md transition-colors duration-200 ${darkMode ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
          >
            {isRunning ? (
              <>
                <Square className="w-5 h-5 mr-2" />
                Stop Test
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Test
              </>
            )}
          </Button>
        </div>
        {currentTest && (
          <div className="mt-4">
            <p className={`text-center text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentTest === 'download' ? 'Testing download speed...' :
               currentTest === 'upload' ? 'Testing upload speed...' :
               'Measuring latency...'}
            </p>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </div>
    </div>
  )
}

export default SpeedTest