import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useState, useEffect } from "react";
import ErrorMessage from "../components/ErrorMessage";
import axios from "axios";
import moment from "moment";
import AddSprintModal from "./AddSprintModal";
import SprintTasksModal from "./SprintTasksModal";
import TasksTable from "./TasksTable";
import SprintProgress from "./SprintProgress";
//import Taskbar from "../components/Taskbar";

// TODO: Add an error message tag under the table if something went wrong!

const Tasks = () => {
    var new_date;
    var superID;
    // Getting access token of current user.
    const [ token, _ ] = useContext( UserContext );

    // Error message for axios requests.
    const [ errorMessage, setErrorMessage ] = useState( "" );

    // Sprints of current user.
    const [ sprints, setSprints ] = useState( [] );

    // Request success confirmation.
    const [ isLoaded, setIsLoaded ] = useState( false );

    // Sprint Modal active flag.
    const [ isSprintModalActive, setIsSPrintModalActive ] = useState( false );

    // Task Modal active flag.
    const [ isTaskModalActive, setIsTaskModalActive ] = useState ( false );

    const [ id, setId ] = useState( null );

    const [ inputID, setInput] = useState(null);

    // Setting up headers and request.
    const getSprintsCurrentUser = async () => {
        // Custom Axios config headers.
        const config = { 
            headers: {
                Authorization: "Bearer " + token
            }
        };
        // Send a get request to server.
        axios.get( "http://localhost:8000/api/show_sprints", config )
            .then( ( response ) => { 
                setSprints( response.data );
                setIsLoaded( true );
                // console.log( response.data );
            } )
            .catch( ( error ) => { 
                // Received a response from server but not the right format.
                if( error.response ){
                    console.log( error.response.status );
                    console.log( error.response.statusText );
                    setErrorMessage( error.response.statusText );
                } 
                // Didn't receive a response, server-side issues.
                else if( error.request ){
                    console.log( error.request );
                }
                // Something is wrong with Axios Config.
                else {
                    console.log( error.message );
                    setErrorMessage( "Something went wrong with Axios" );
                }
            });
    }; 

    const handleDeleteSprint = async ( sprint_id ) => {
        // Custom Axios config headers.
        const config = {
            headers : {
                Authorization: "Bearer " + token
            }
        };
        
        // Send a delete request with the provided sprint_id to server.
        axios.delete( `http://localhost:8000/api/delete_sprint/${sprint_id}`, config )
            .then( ( response ) => {
                console.log( response.data.message );
            })
            .catch( ( error ) => {
                // Received a response from server but not the right format.
                if( error.response ){
                    console.log( error.response.status );
                    console.log( error.response.statusText );
                    setErrorMessage( error.response.statusText );
                } 
                // Didn't receive a response, server-side issues.
                else if( error.request ){
                    console.log( error.request );
                }
                // Something is wrong with Axios Config.
                else {
                    console.log( error.message );
                    setErrorMessage( "Something went wrong with Axios" );
                }
            });
        // Fetch sprints of current user everytime we delete something.
        getSprintsCurrentUser();
    };

    // Set the active flag of the modal to false to close the modal.
    // Also fetch the sprints of the current user and set the ID to null.
    const handleSprintModalClose = () => {
        setIsSPrintModalActive( !isSprintModalActive );
        getSprintsCurrentUser();
        //setId( null );
    };

    // Set the active flag of the modal to false to close the modal.
    // Also fetch the sprints of the current user and set the ID to null.
    const handleTaskModalClose = () => {
        setIsTaskModalActive( !isTaskModalActive );
        getSprintsCurrentUser();
        //setId( null );
    };


    const handleUpdateSprint = async ( sprint_id ) => {
        setId( sprint_id );
        setIsSPrintModalActive( true );
    };

    const handleSprintNameClick = async ( sprint_id ) => {
        setId( sprint_id );
        setIsTaskModalActive( true );
    };

    // Getting all the sprints of the current user/employee everytime the page loads.
    useEffect( () => {
        getSprintsCurrentUser();
    }, [] )
    console.log(id);
    return (
        <div>
            {/* <Taskbar /> */}
            {/* <button className="w-full h-12 px-6 text-white transition-colors duration-150 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClickCapture={ () => { setId( null ) } }
                    onClick={ () => { setIsSPrintModalActive( true ) } }>
                    Add Sprint
            </button> */}

            { /* Only load the table if successfully fetched from backend. */}
            { isLoaded && sprints ? (
                <>
                <button className="relative rounded-sm dark:hover:bg-gray-600 -right-52 -top-8"
                    onClickCapture={ () => { setId( null ) } }
                    onClick={ () => { setIsSPrintModalActive( true ) } }>
                    <svg xmlns="http://www.w3.org/2000/svg"
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.7} 
                        stroke="currentColor" 
                        className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <div className=" relative scrollbar-hide md:scrollbar-default grid grid-cols-6 gap-2 grid-rows-2 grid-flow-col pl-10 pr-10">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg col-start-2 col-span-4 right-24 -top-12 row-start-1 row-span-1"> 
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400"> 
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-500 dark:text-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Sprint name
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Sprint ID
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Start Date
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only"> Action </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                { /* Renders all sprints of the current user fetched from URL */}
                                { sprints.map( ( sprint ) => (
                                    <tr className={"text-black" + (id == sprint.sprint_id ? "bg-white border-b dark:bg-gray-700 dark:border-gray-500 hover:bg-gray-700 dark:hover:bg-gray-700 text-white cursor-pointer" : "bg-white border-b dark:bg-gray-600 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 text-white  cursor-pointer")}
                                    onClickCapture={()=> setId(sprint.sprint_id)}
                                    key={ sprint.sprint_id }>
                                        <th scope="row"
                                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            //onClick={ () => handleSprintNameClick( sprint.sprint_id ) }
                                            >
                                            { sprint.sprint_name }
                                        </th>
                                        <td className="px-6 py-4">
                                            { sprint.sprint_id }
                                        </td>
                                        <td className="px-6 py-4">
                                            { moment( sprint.start_date ).format( "MMM Do YYYY" ) }
                                        </td> 
                                        <td className="px-6 py-4 text-right">
                                            <button type="button" 
                                                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                    onClick={ () => handleUpdateSprint( sprint.sprint_id ) }>
                                                Edit
                                            </button>
                                            <button type="button"
                                                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                                    onClick={ () => handleDeleteSprint( sprint.sprint_id ) }>
                                                Delete
                                            </button>
                                        </td>         
                                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="relative col-start-2 col-span-4 right-32 row-start-2 row-span-1">
                        <TasksTable token={ token }
                                    id={ id }>
                        </TasksTable>
                    </div>

                    {/* <div className="absolute right-1/4 top-30">
                        <h1 className="pb-10">Sprint Progress</h1>
                        <SprintProgress token={ token }
                                    id={ id }>
                        </SprintProgress>
                    </div> */}

                    <AddSprintModal isActiveModal={ isSprintModalActive }
                                    onClose={ handleSprintModalClose }
                                    token={ token }
                                    setErrorMessage={ setErrorMessage }
                                    id={ id }>
                    </AddSprintModal>
                    <SprintTasksModal isActive={ isTaskModalActive }
                                    onClose={ handleTaskModalClose }
                                    token={ token }
                                    setErrorMessage={ setErrorMessage }
                                    id={ id }>
                    </SprintTasksModal>
                </div>
                </>
            ) : (
                <h1> Loading </h1>
            )}
        </div>
    )
};

export default Tasks;