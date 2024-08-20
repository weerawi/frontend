import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Title from '../Components/Title';
import nic from '../Assets/nic.jpg';
import SubTitle from '../Components/SubTitle';


const Home = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [invalidNicDetails, setInvalidNicDetails] = useState({});

    // Handle file input change
    const handleFileChange = (e) => {
        setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
        // Clear messages and invalid NIC details when new files are added
        clearMessagesAndInvalidNics();
    };

    // Handle drag and drop
    const handleDrop = (e) => {
        e.preventDefault();
        setFiles((prevFiles) => [...prevFiles, ...Array.from(e.dataTransfer.files)]);
        // Clear messages and invalid NIC details when new files are dropped
        clearMessagesAndInvalidNics();
    };

    // Clear messages and invalid NIC details when new files are added
    const clearMessagesAndInvalidNics = () => {
        setError(null);
        setSuccessMessage('');
        setInvalidNicDetails({});
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        clearMessagesAndInvalidNics(); // Clear existing messages and invalid NIC details before upload

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            const token = Cookies.get('access_token');
            console.log("JWT Token:", token);

            if (!token) {
                setError('No access token found. Please sign in.');
                setLoading(false);
                return;
            }

            const response = await axios.post('http://localhost:8080/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            setSuccessMessage('Files uploaded successfully!');
            setInvalidNicDetails(response.data.invalidNicDetails || {});

            // Clear files after successful upload
            setFiles([]);

        } catch (error) {
            console.error('Error uploading files:', error.response || error.message);
            setError('Failed to upload files. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className='m-5 mt-10 mb-20 flex flex-col items-center' data-aos="fade-down" data-aos-duration="800">
            
            <div className="file-upload-form shadow-xl shadow-gray-500 p-10 rounded-2xl w-[800px] py-16 bg-gradient-to-r from-green-300 via-yellow-300 to-sky-200 ">
                <Title title="NIC Validation File Upload"/>

                <div className='flex flex-col md:flex-row  rounded-2xl h-auto text-white ' 
                style={{ 
                    backgroundImage: `url(${nic})`,
                    backgroundSize: 'cover',   
                    backgroundRepeat: 'no-repeat'
                  }}>
                     
                    

                    <div
                        className='w-full flex   backdrop-blur-sm bg-[rgba(0,0,0,0.5)] p-16 pb-20 rounded-2xl
                         shadow-lg shadow-gray-500 justify-center'
                         
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <form onSubmit={handleSubmit} className='items-center   flex flex-col md:flex-row'>
                            <div className="mb-4 flex flex-col items-center justify-between gap-10">
                                {/* Drag and Drop Icon */}
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-4/5 p-2 border border-gray-300 rounded"
                                />
                                <div className=' flex flex-col rounded-md w-3/5 items-center justify-center'>
                                    {/* <SubTitle title="Drag and drop files here"/>

                                    <AiOutlineCloudUpload className="text-8xl text-gray-500 mb-4  backdrop-blur-sm " /> */}
                                    <div className="mb-4">
                                        <p>Uploaded Files:</p>
                                        <ul>
                                            {files.map((file, index) => (
                                                <li key={index}>{file.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-[150px] p-2 bg-blue-500 text-white rounded"
                                    >
                                        {loading ? 'Uploading...' : 'Upload Files'}
                                    </button>
                                
                                </div>
                            </div>

                            <div className='flex flex-col p-5 items-center rounded-2xl bg-[rgba(255,255,255,0.6)]'>
                                <SubTitle title="Drag and drop files here"/>

                                <AiOutlineCloudUpload className="text-8xl text-gray-500 mb-4  backdrop-blur-sm " />
                                    
                            </div>
                                        
                        </form>
                    </div>
                </div>




                {/* Display Success or Error Message */}
                {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                

                {/* Display invalid NIC counts */}
                {Object.keys(invalidNicDetails).length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-red-500 font-bold mb-2">Invalid NIC Count:</h2>
                        <ul>
                            {Object.entries(invalidNicDetails).map(([fileName, errors]) => (
                                <li key={fileName}>
                                    <p className="font-semibold">
                                        {fileName} - {errors.length} invalid NIC(s)
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
)}

            </div>
        </div>
    );
};

export default Home;
