using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Serilog;
using static System.String;

namespace RadioWatch.Controllers
{

    public class GridDataResponse<T>
    {
        public List<T> Data { get; set; }
        public int Total { get; set; }
    }

    public class GridDataRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string Sort { get; set; }
        public int By { get; set; }
    }

    public static class GridDataResponseExtensions
    {
        public static List<T> ApplyPaging<T>(this IQueryable<T> query, int page, int pageSize)
        {
            return query.Skip(page*pageSize).Take(pageSize).ToList();
        }

        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, string sort, int by)
        {
            if (!IsNullOrWhiteSpace(sort))
            {
                var props = typeof(T).GetProperties();
                var sortBy = props.FirstOrDefault(x => x.Name == sort.FirstOrDefault().ToString().ToUpper() + Join("", sort.Skip(1)));
                if (sortBy != null)
                {
                    return by == -1 ? query.OrderByDescending(x => sortBy.GetValue(x)) : by == 1 ? query.OrderBy(x => sortBy.GetValue(x)) : query;
                }
            }
            return query;
        }
    }


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
                new RadioTrack{ Key=3, Artist= "stankyartist", Song= "dirtyTrack", TimePlayed= new DateTime(2010,1,1)},
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
