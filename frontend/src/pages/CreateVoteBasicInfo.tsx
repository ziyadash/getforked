import { useState } from 'react';
import { useNavigate } from 'react-router';
import StyledBackground from '../components/background/StyledBackground';
import ThinButton from '../components/buttons/ThinGradientButton';
import '../components/logo/Banner.css';

export default function CreateVoteBasicInfo() {
    const navigate = useNavigate();
    const [requireVerification, setRequireVerification] = useState(true);
    const goBack = () => {
        navigate('/creator/view-voting-sessions');
    }

    const goToAddPositions = () => {
        navigate('/manager/addPositions');
    }
    return (
        <StyledBackground className='main'>
            <div className="
                flex flex-col overflow-y-auto no-scrollbar gap-[1.5em] 
                h-[100vh]
                pt-[0rem]
                p-[6rem]
            ">
                <button className="text-white p-4 text-2xl absolute top-2 left-4 z-10" onClick={goBack}>
                    ←
                </button>

                <div className="w-full max-w-3xl mx-auto px-4">
                    <h1 className="text-4xl text-white text-center mt-4 mb-8">Create a New Vote</h1>

                    <div className="border-2 border-[#f1e9e9] bg-linear-130 from-transparent to-white/30 backdrop-blur-sm rounded-4xl p-6 md:p-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="voteName" className="text-white text-lg">
                                    Vote Name
                                </label>
                                <input
                                    id="voteName"
                                    type="text"
                                    placeholder="DevSoc AGM Voting 2025"
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
                                        placeholder="F10 Junge Griffith M17"
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
                                        placeholder="Wed 2nd October, 4:45pm"
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
                                    placeholder={`This meeting will be held to receive executive reports for 2024 📝, propose and approve amendments to our Club's constitution as well as announce our new Executive team for the next 12 months!

    Executive will also showcase all the new features developed under our current development.`}
                                />
                            </div>

                            <div>
                                <button className="flex items-center gap-2 text-white">
                                    <span>Add image</span>
                                    <div className="hover:cursor-pointer hover:opacity-50 bg-linear-130 border-[0.5px] from-white/30 rounded-full flex flex-col items-center justify-center p-4 h-2 w-2">
                                        +
                                    </div>
                                </button>
                            </div>

                            <div className="flex items-center">
                                <span className="text-white text-lg">Require zID verification for voters</span>
                                <label className="relative inline-flex ml-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={requireVerification}
                                        onChange={() => setRequireVerification(!requireVerification)}
                                    />
                                    <div className="w-11 h-6 bg-[#a2a2a2] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6b1bb2]"></div>
                                </label>
                            </div>

                            <div className="flex justify-center mt-6">
                                <ThinButton text="Continue" margin="mt-2" onClick={() => goToAddPositions()} w={'w-30'} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </StyledBackground>
    );
}
