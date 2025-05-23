import { useState } from 'react';
import StyledBackground from '../components/background/StyledBackground';
import ThinButton from '../components/buttons/ThinButton';
import '../components/logo/Banner.css';

export default function CreateVoteBasicInfo() {
    const [requireVerification, setRequireVerification] = useState(true);

    return (
        <StyledBackground className='main'>
            <button className="text-white p-4 text-2xl absolute top-2 left-4 z-10">
                ←
            </button>
            
            <div className="w-full max-w-3xl mx-auto px-4 pt-16">
                <h1 className="title text-center mt-4 mb-8">Create Vote</h1>

                <div className="border-2 border-[#f1e9e9] bg-white/20 backdrop-blur-sm rounded-4xl p-6 md:p-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="voteName" className="text-white text-lg">
                                Vote Name
                            </label>
                            <input
                                id="voteName"
                                type="text"
                                defaultValue="DevSoc AGM Voting 2025"
                                className="w-full p-3 rounded-md bg-white text-black"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="location" className="text-white text-lg">
                                    Location
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    defaultValue="F10 Junge Griffith M17"
                                    className="w-full p-3 rounded-md bg-white text-black"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="dateTime" className="text-white text-lg">
                                    Date / Time
                                </label>
                                <input
                                    id="dateTime"
                                    type="text"
                                    defaultValue="Wed 2nd October, 4:45pm"
                                    className="w-full p-3 rounded-md bg-white text-black"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-white text-lg">
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={6}
                                className="w-full p-3 rounded-md bg-white text-black"
                                defaultValue={`This meeting will be held to receive executive reports for 2024 📝, propose and approve amendments to our Club's constitution as well as announce our new Executive team for the next 12 months!

Executive will also showcase all the new features developed under our current development.`}
                            />
                        </div>

                        <div>
                            <button className="flex items-center gap-2 text-white">
                                <span>Add image</span>
                                <div className="bg-white/20 rounded-full p-1">
                                    +
                                </div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-white text-lg">Require zID verification for voters</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={requireVerification}
                                    onChange={() => setRequireVerification(!requireVerification)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#34c759]"></div>
                            </label>
                        </div>

                        <div className="flex justify-center mt-6">
                            <ThinButton text="Continue" margin="mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </StyledBackground>
    );
}
