using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using RadioWatch.Helpers.Grid;
using Serilog;

namespace RadioWatch.Controllers
{
    [Route("api/[controller]")]
    public class PlaylistController : Controller
    {
        // GET: api/values
        [HttpGet("")]
        public JsonResult Values(GridDataRequest request)
        {
            var values = RadioRepository.Get();
            return new JsonResult(new GridDataResponse<RadioTrack> { Data = values.AsQueryable().ApplySorting(request.Sort, request.By).ApplyPaging(request.Page, request.PageSize), Total = values.Count });
        }

        [HttpPost("")]
        public JsonResult Values([FromBody] JObject note)
        {
            var noteAsObject = note.ToObject<RadioTrack>();
            noteAsObject.Key = RadioRepository.Notes.Count;
            Log.Logger.Information("Add Request with {@noteAsObject}", noteAsObject);
            var noteAdded = RadioRepository.Add(noteAsObject);
            return new JsonResult(noteAdded);
        }

        [HttpDelete("{id}")]
        public JsonResult Values(int id)
        {
            Log.Logger.Information($"Delete Request with id: {id}");
            var note = RadioRepository.Delete(id);
            return new JsonResult(note);
        }
    }


    public class RadioTrack
    {
        public int Key { get; set; }
        public string Artist { get; set; }
        public string Song { get; set; }
        public DateTime TimePlayed { get; set; }
    }

    public static class RadioRepository
    {
        public static List<RadioTrack> Notes { get; set; }

        static RadioRepository()
        {
            Notes = new List<RadioTrack>
            {
                new RadioTrack{ Key=1, Artist= "dirtyartist",  Song= "sta",  TimePlayed= new DateTime(2010,1,1) },
                new RadioTrack{ Key=2, Artist= "stankyartist", Song= "stankyTrack", TimePlayed= new DateTime(2010,1,1) },
                new RadioTrack{ Key=3, Artist= "stankyartist", Song= "dirtyTrack", TimePlayed= new DateTime(1990,1,1)},
                new RadioTrack{ Key=4, Artist= "stankyartist", Song= "stankyTrack", TimePlayed= new DateTime(2010,1,1)},
                new RadioTrack{ Key=5, Artist= "stankyartist", Song= "stankyTrack", TimePlayed= new DateTime(2010,1,1)},
                new RadioTrack{ Key=6, Artist= "stankyartist", Song= "stankyTrack", TimePlayed= new DateTime(2010,1,1)},
                new RadioTrack{ Key=7, Artist= "stankyartist", Song= "stankyTrack", TimePlayed= new DateTime(2010,1,1) },
            };
        }

        public static List<RadioTrack> Get()
        {
            return Notes;
        }

        public static RadioTrack Add(RadioTrack note)
        {
            Notes.Add(note);
            return note;
        }

        public static RadioTrack Delete(int id)
        {
            var matchingNote = Notes.FirstOrDefault(x => x.Key == id);
            if (matchingNote == null)
                Log.Logger.Information($"Could not find id: {id}");
            Notes.Remove(matchingNote);
            return matchingNote;
        }
    }


}
